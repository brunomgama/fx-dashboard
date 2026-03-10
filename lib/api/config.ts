/**
 * API Configuration
 *
 * Centralized configuration for all API endpoints
 */

export interface ApiEndpointConfig {
	baseURL: string;
	endpoints: Record<string, string>;
}

export interface ApiConfig {
	stepFunction: ApiEndpointConfig;
	flowLauncher: ApiEndpointConfig;
	emailService: ApiEndpointConfig;
	awsSso: ApiEndpointConfig;
}

export const apiConfig: ApiConfig = {
	stepFunction: {
		baseURL: '/api/step-function',
		endpoints: {
			list: '/list',
			describe: '/describe',
			executions: '/executions',
		},
	},
	flowLauncher: {
		baseURL: '/api/flow-launcher',
		endpoints: {
			execute: '/execute',
			flows: '/flows',
			events: '/events',
		},
	},
	emailService: {
		baseURL: '/api/email-service',
		endpoints: {
			campaigns: '/campaigns',
			templates: '/templates',
			send: '/send',
		},
	},
	awsSso: {
		baseURL: '/api/aws-sso',
		endpoints: {
			login: '/login',
			status: '/status',
			logout: '/logout',
		},
	},
};

/**
 * Get full endpoint URL
 */
export function getEndpointUrl(service: keyof ApiConfig, endpoint: string, params?: Record<string, string | number>): string {
	const config = apiConfig[service];
	let url = `${config.baseURL}${config.endpoints[endpoint] || endpoint}`;

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url = url.replace(`:${key}`, String(value));
		});
	}

	return url;
}
