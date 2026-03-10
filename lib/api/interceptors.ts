/**
 * API Interceptors
 *
 * Pre-configured interceptors for logging, monitoring, and error handling
 */

import type { RequestInterceptor, ResponseInterceptor } from './base-api-client';

/**
 * Logging Interceptor
 * Logs all requests and responses for debugging
 */
export const loggingInterceptor: RequestInterceptor & ResponseInterceptor = {
	onRequest: (config) => {
		console.log(`[API Request] ${config.method || 'GET'} ${config.url}`, {
			params: config.params,
			timestamp: new Date().toISOString(),
		});
		return config;
	},
	onResponse: (response) => {
		console.log(`[API Response] ${response.status} ${response.config.url}`, {
			status: response.status,
			timestamp: new Date().toISOString(),
		});
		return response;
	},
	onResponseError: (error) => {
		console.error(`[API Error] ${error.status || 'Unknown'} ${error.config?.url || 'Unknown URL'}`, {
			message: error.message,
			status: error.status,
			data: error.data,
			timestamp: new Date().toISOString(),
		});
	},
};

/**
 * Performance Monitoring Interceptor
 * Tracks API call performance
 */
export const performanceInterceptor: RequestInterceptor & ResponseInterceptor = {
	onRequest: (config) => {
		// Attach start time to config
		(config as any)._startTime = performance.now();
		return config;
	},
	onResponse: (response) => {
		const startTime = (response.config as any)._startTime;
		if (startTime) {
			const duration = performance.now() - startTime;
			console.log(`[API Performance] ${response.config.url} completed in ${duration.toFixed(2)}ms`);
		}
		return response;
	},
};

/**
 * Authentication Interceptor
 * Adds authentication headers to requests
 */
export const authInterceptor: RequestInterceptor = {
	onRequest: (config) => {
		// Get auth token from localStorage or session
		const token = typeof window !== 'undefined' ? localStorage.getItem('aws_sso_token') : null;

		if (token) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${token}`,
			};
		}

		return config;
	},
};

/**
 * Environment Interceptor
 * Adds environment context to requests
 */
export const environmentInterceptor: RequestInterceptor = {
	onRequest: (config) => {
		const environment = typeof window !== 'undefined' ? localStorage.getItem('selected_environment') : null;

		if (environment) {
			config.headers = {
				...config.headers,
				'X-Environment': environment,
			};
		}

		return config;
	},
};

/**
 * Error Handler Interceptor
 * Provides user-friendly error messages
 */
export const errorHandlerInterceptor: ResponseInterceptor = {
	onResponseError: (error) => {
		// Map common error codes to user-friendly messages
		const errorMessages: Record<number, string> = {
			400: 'Invalid request. Please check your input.',
			401: 'Authentication required. Please log in.',
			403: 'Access denied. You do not have permission.',
			404: 'Resource not found.',
			408: 'Request timeout. Please try again.',
			429: 'Too many requests. Please slow down.',
			500: 'Server error. Please try again later.',
			502: 'Bad gateway. Please try again later.',
			503: 'Service unavailable. Please try again later.',
			504: 'Gateway timeout. Please try again later.',
		};

		const userMessage = error.status ? errorMessages[error.status] || error.message : error.message;

		// You can emit this to a toast notification system
		if (typeof window !== 'undefined') {
			// Dispatch custom event for global error handling
			window.dispatchEvent(
				new CustomEvent('api-error', {
					detail: {
						message: userMessage,
						error,
					},
				})
			);
		}
	},
};

/**
 * Retry Interceptor
 * Custom retry logic for specific endpoints
 */
export const retryInterceptor: ResponseInterceptor = {
	onResponseError: async (error) => {
		// Track retry attempts
		if (error.config) {
			const retryCount = (error.config as any)._retryCount || 0;
			(error.config as any)._retryCount = retryCount + 1;
		}
	},
};
