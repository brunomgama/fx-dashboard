/**
 * Base API Client
 *
 * Provides a foundational HTTP client with:
 * - Request/Response interceptors
 * - Centralized error handling
 * - Automatic retry logic
 * - Request/Response logging
 * - Type-safe API calls
 */

export interface RequestInterceptor {
	onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
	onRequestError?: (error: Error) => void | Promise<void>;
}

export interface ResponseInterceptor {
	onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
	onResponseError?: (error: ApiError) => void | Promise<void>;
}

export interface RequestConfig extends RequestInit {
	baseURL?: string;
	url: string;
	params?: Record<string, string | number | boolean | undefined | null>;
	timeout?: number;
	retry?: RetryConfig;
	skipInterceptors?: boolean;
}

export interface RetryConfig {
	maxRetries: number;
	retryDelay: number;
	retryOn?: number[];
}

export interface ApiResponse<T = unknown> {
	data: T;
	status: number;
	statusText: string;
	headers: Headers;
	config: RequestConfig;
}

export interface ApiError {
	message: string;
	status?: number;
	statusText?: string;
	data?: unknown;
	config?: RequestConfig;
}

export interface BaseApiClientConfig {
	baseURL: string;
	headers?: HeadersInit;
	timeout?: number;
	retry?: RetryConfig;
}

export class BaseApiClient {
	private baseURL: string;
	private defaultHeaders: HeadersInit;
	private timeout: number;
	private retryConfig: RetryConfig;
	private requestInterceptors: RequestInterceptor[] = [];
	private responseInterceptors: ResponseInterceptor[] = [];

	constructor(config: BaseApiClientConfig) {
		this.baseURL = config.baseURL;
		this.defaultHeaders = config.headers || {};
		this.timeout = config.timeout || 30000;
		this.retryConfig = config.retry || {
			maxRetries: 3,
			retryDelay: 1000,
			retryOn: [408, 429, 500, 502, 503, 504],
		};
	}

	/**
	 * Add a request interceptor
	 */
	addRequestInterceptor(interceptor: RequestInterceptor): void {
		this.requestInterceptors.push(interceptor);
	}

	/**
	 * Add a response interceptor
	 */
	addResponseInterceptor(interceptor: ResponseInterceptor): void {
		this.responseInterceptors.push(interceptor);
	}

	/**
	 * Build query string from params
	 */
	private buildQueryString(params?: Record<string, string | number | boolean | undefined | null>): string {
		if (!params || Object.keys(params).length === 0) return '';

		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});

		return `?${searchParams.toString()}`;
	}

	/**
	 * Run request interceptors
	 */
	private async runRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
		if (config.skipInterceptors) return config;

		let modifiedConfig = config;
		for (const interceptor of this.requestInterceptors) {
			if (interceptor.onRequest) {
				try {
					modifiedConfig = await interceptor.onRequest(modifiedConfig);
				} catch (error) {
					if (interceptor.onRequestError) {
						await interceptor.onRequestError(error as Error);
					}
					throw error;
				}
			}
		}
		return modifiedConfig;
	}

	/**
	 * Run response interceptors
	 */
	private async runResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
		let modifiedResponse = response;
		for (const interceptor of this.responseInterceptors) {
			if (interceptor.onResponse) {
				try {
					modifiedResponse = await interceptor.onResponse(modifiedResponse);
				} catch (error) {
					if (interceptor.onResponseError) {
						await interceptor.onResponseError(error as ApiError);
					}
					throw error;
				}
			}
		}
		return modifiedResponse;
	}

	/**
	 * Handle response errors through interceptors
	 */
	private async handleResponseError(error: ApiError): Promise<void> {
		for (const interceptor of this.responseInterceptors) {
			if (interceptor.onResponseError) {
				await interceptor.onResponseError(error);
			}
		}
	}

	/**
	 * Sleep utility for retry delay
	 */
	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Make HTTP request with retry logic
	 */
	private async makeRequestWithRetry<T>(config: RequestConfig, attempt: number = 0): Promise<ApiResponse<T>> {
		const url = `${config.baseURL || this.baseURL}${config.url}`;
		const queryString = this.buildQueryString(config.params);
		const fullUrl = `${url}${queryString}`;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.timeout);

		try {
			const response = await fetch(fullUrl, {
				...config,
				headers: {
					'Content-Type': 'application/json',
					...this.defaultHeaders,
					...config.headers,
				},
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			// Handle non-OK responses
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: response.statusText }));
				const apiError: ApiError = {
					message: errorData.error || errorData.message || 'API request failed',
					status: response.status,
					statusText: response.statusText,
					data: errorData,
					config,
				};

				// Check if we should retry
				const retryConfig = config.retry || this.retryConfig;
				const shouldRetry = retryConfig.retryOn?.includes(response.status) && attempt < retryConfig.maxRetries;

				if (shouldRetry) {
					await this.sleep(retryConfig.retryDelay * (attempt + 1));
					return this.makeRequestWithRetry<T>(config, attempt + 1);
				}

				await this.handleResponseError(apiError);
				throw new Error(apiError.message);
			}

			// Parse response
			const text = await response.text();
			let data: T;

			if (!text) {
				data = {} as T;
			} else {
				try {
					data = JSON.parse(text);
				} catch {
					data = text as unknown as T;
				}
			}

			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers,
				config,
			};
		} catch (error) {
			clearTimeout(timeoutId);

			// Handle timeout
			if (error instanceof Error && error.name === 'AbortError') {
				const apiError: ApiError = {
					message: 'Request timeout',
					status: 408,
					config,
				};
				await this.handleResponseError(apiError);
				throw new Error(apiError.message);
			}

			// Handle network errors
			const apiError: ApiError = {
				message: error instanceof Error ? error.message : 'Network error',
				config,
			};
			await this.handleResponseError(apiError);
			throw error;
		}
	}

	/**
	 * Public request method
	 */
	async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
		// Run request interceptors
		const modifiedConfig = await this.runRequestInterceptors(config);

		// Make request
		const response = await this.makeRequestWithRetry<T>(modifiedConfig);

		// Run response interceptors
		return this.runResponseInterceptors(response);
	}

	/**
	 * Convenience methods
	 */
	async get<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: 'GET' });
	}

	async post<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
		return this.request<T>({
			...config,
			url,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async put<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
		return this.request<T>({
			...config,
			url,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async patch<T>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
		return this.request<T>({
			...config,
			url,
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async delete<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: 'DELETE' });
	}
}
