/**
 * Unified API Client
 *
 * Main API client that combines all service APIs
 * Note: Email Service uses its own feature-specific API in features/email-service/api
 */

import { BaseApiClient } from './base-api-client';
import { apiConfig } from './config';
import { authInterceptor, environmentInterceptor, errorHandlerInterceptor, loggingInterceptor, performanceInterceptor } from './interceptors';

/**
 * Step Function API Types
 */
export interface StateMachine {
	stateMachineArn: string;
	name: string;
	status: string;
	creationDate: string;
	type?: string;
}

export interface StateMachineExecution {
	executionArn: string;
	stateMachineArn: string;
	name: string;
	status: string;
	startDate: string;
	stopDate?: string;
	input?: string;
	output?: string;
}

export interface DescribeStateMachineResponse {
	stateMachineArn: string;
	name: string;
	status: string;
	definition: string;
	roleArn: string;
	type: string;
	creationDate: string;
	loggingConfiguration?: {
		level?: string;
		includeExecutionData?: boolean;
		destinations?: Array<{
			cloudWatchLogsLogGroup?: {
				logGroupArn?: string;
			};
		}>;
	};
}

/**
 * Flow Launcher API Types
 */
export interface FlowLauncherFlow {
	id: string;
	name: string;
	arn: string;
	description: string;
	input: string;
	variables?: string[];
	created_at?: string;
	updated_at?: string;
	user?: string;
}

export interface FlowLauncherEvent {
	id: string;
	name: string;
	description: string;
	flow_ids: string[];
	input: string;
	variables?: string[];
	created_at?: string;
	updated_at?: string;
	user?: string;
}

export interface EventConfig {
	id: string;
	defaults: string;
	created_at?: string;
	updated_at?: string;
	user?: string;
}

export interface TriggerEventRequest {
	name?: string;
	id?: string;
	input?: Record<string, unknown>;
}

export interface TriggerEventResponse {
	executionArn: string;
	startDate: string;
	status?: string;
}

export interface ListResponse<T> {
	results?: T[];
	Items?: T[];
	items?: T[];
	count?: number;
	lastEvaluatedKey?: string;
}

export interface ListParams {
	limit?: number;
	lastKey?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	[key: string]: string | number | undefined;
}

/**
 * Email Service API Types
 */
export type CampaignStatus = 'draft' | 'planned' | 'sending' | 'sent' | 'archived' | 'incomplete';

export interface Campaign {
	id: string;
	name: string;
	local: string;
	audienceId: string;
	senderId: string;
	senderAlias: string;
	subject: string;
	content: string;
	templateId: string;
	type: string;
	status: CampaignStatus;
	previousStatus: string;
	description?: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

export interface Template {
	id: string;
	name: string;
	locale: string;
	emailType: string;
	header: string;
	footer: string;
	status: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

export interface Audience {
	id: string;
	name: string;
	local: string;
	definition?: string;
	audienceTypeId: string;
	emailType: string;
	sql: string;
	countRecipients: number;
	active: boolean;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

export interface AudienceType {
	id: string;
	name: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

export interface Sender {
	id: string;
	email: string;
	alias: string[];
	emailTypes: string[];
	active: boolean;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

export interface Setting {
	id: string;
	value: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

export interface Unsubscribe {
	email: string;
	emailType: string;
	campaignId?: string;
	unsubscribeDate: string;
}

export interface SESStatusResponse {
	reputationMetrics?: {
		bounceRate: number;
		complaintRate: number;
	};
	sendQuota?: {
		max24HourSend: number;
		maxSendRate: number;
		sentLast24Hours: number;
	};
	cloudWatchMetrics?: Array<{
		MetricName: string;
		Timestamp: string;
		Value: number;
		Unit: string;
	}>;
	statistics?: {
		Sends?: number;
		Rejects?: number;
		Bounces?: number;
		Complaints?: number;
		DeliveryAttempts?: number;
	};
}

/**
 * AWS SSO API Types
 */
export interface AwsSsoStatus {
	isAuthenticated: boolean;
	profile?: string;
	region?: string;
	expiresAt?: string;
}

export interface AwsSsoLoginRequest {
	profile: string;
	region?: string;
}

export interface AwsSsoLoginResponse {
	success: boolean;
	message: string;
	verificationUrl?: string;
}

/**
 * Unified API Client Class
 */
class UnifiedApiClient {
	private stepFunctionClient: BaseApiClient;
	private flowLauncherClient: BaseApiClient;
	private emailServiceClient: BaseApiClient;
	private awsSsoClient: BaseApiClient;

	constructor(enableLogging: boolean = process.env.NODE_ENV === 'development') {
		// Initialize clients for each service
		this.stepFunctionClient = new BaseApiClient({
			baseURL: apiConfig.stepFunction.baseURL,
		});

		this.flowLauncherClient = new BaseApiClient({
			baseURL: apiConfig.flowLauncher.baseURL,
		});

		this.emailServiceClient = new BaseApiClient({
			baseURL: apiConfig.emailService.baseURL,
		});

		this.awsSsoClient = new BaseApiClient({
			baseURL: apiConfig.awsSso.baseURL,
		});

		// Add interceptors to all clients
		const clients = [this.stepFunctionClient, this.flowLauncherClient, this.emailServiceClient, this.awsSsoClient];

		clients.forEach((client) => {
			// Always add auth and environment interceptors
			client.addRequestInterceptor(authInterceptor);
			client.addRequestInterceptor(environmentInterceptor);

			// Add error handler
			client.addResponseInterceptor(errorHandlerInterceptor);

			// Add logging and performance interceptors in development
			if (enableLogging) {
				client.addRequestInterceptor(loggingInterceptor);
				client.addResponseInterceptor(loggingInterceptor);
				client.addResponseInterceptor(performanceInterceptor);
			}
		});
	}

	/**
	 * Step Function API Methods
	 */
	stepFunction = {
		listStateMachines: async (params?: { maxResults?: number; nextToken?: string }) => {
			const response = await this.stepFunctionClient.get<{ stateMachines: StateMachine[] }>(apiConfig.stepFunction.endpoints.list, { params });
			return response.data;
		},

		describeStateMachine: async (stateMachineArn: string) => {
			const response = await this.stepFunctionClient.get<DescribeStateMachineResponse>(apiConfig.stepFunction.endpoints.describe, { params: { stateMachineArn } });
			return response.data;
		},

		listExecutions: async (params: { stateMachineArn: string; statusFilter?: string; maxResults?: number; nextToken?: string }) => {
			const response = await this.stepFunctionClient.get<{ executions: StateMachineExecution[] }>(apiConfig.stepFunction.endpoints.executions, { params });
			return response.data;
		},
	};

	/**
	 * Flow Launcher API Methods
	 */
	flowLauncher = {
		// Flows
		listFlows: async (params?: ListParams) => {
			const response = await this.flowLauncherClient.get<ListResponse<FlowLauncherFlow>>('/flows', { params });
			return response.data;
		},

		getFlow: async (id: string) => {
			const response = await this.flowLauncherClient.get<FlowLauncherFlow>(`/flows/${id}`);
			return response.data;
		},

		createFlow: async (data: Partial<FlowLauncherFlow> & { user: string }) => {
			const response = await this.flowLauncherClient.post<FlowLauncherFlow>('/flows', data);
			return response.data;
		},

		updateFlow: async (id: string, data: Partial<FlowLauncherFlow> & { user: string }) => {
			const response = await this.flowLauncherClient.put<FlowLauncherFlow>(`/flows/${id}`, data);
			return response.data;
		},

		deleteFlow: async (id: string) => {
			const response = await this.flowLauncherClient.delete<{ message: string }>(`/flows/${id}`);
			return response.data;
		},

		// Events
		listEvents: async (params?: ListParams) => {
			const response = await this.flowLauncherClient.get<ListResponse<FlowLauncherEvent>>('/events', { params });
			return response.data;
		},

		getEvent: async (id: string) => {
			const response = await this.flowLauncherClient.get<FlowLauncherEvent>(`/events/${id}`);
			return response.data;
		},

		createEvent: async (data: Partial<FlowLauncherEvent> & { user: string }) => {
			const response = await this.flowLauncherClient.post<FlowLauncherEvent>('/events', data);
			return response.data;
		},

		updateEvent: async (id: string, data: Partial<FlowLauncherEvent> & { user: string }) => {
			const response = await this.flowLauncherClient.put<FlowLauncherEvent>(`/events/${id}`, data);
			return response.data;
		},

		deleteEvent: async (id: string) => {
			const response = await this.flowLauncherClient.delete<{ message: string }>(`/events/${id}`);
			return response.data;
		},

		// Event Configs
		listEventConfigs: async (params?: ListParams) => {
			const response = await this.flowLauncherClient.get<ListResponse<EventConfig>>('/eventconfigs', { params });
			return response.data;
		},

		getEventConfig: async (id: string) => {
			const response = await this.flowLauncherClient.get<EventConfig>(`/eventconfigs/${id}`);
			return response.data;
		},

		createEventConfig: async (data: { user: string; id: string; defaults: string }) => {
			const response = await this.flowLauncherClient.post<EventConfig>('/eventconfigs', data);
			return response.data;
		},

		updateEventConfig: async (id: string, data: { user: string; defaults: string }) => {
			const response = await this.flowLauncherClient.put<EventConfig>(`/eventconfigs/${id}`, data);
			return response.data;
		},

		deleteEventConfig: async (id: string) => {
			const response = await this.flowLauncherClient.delete<{ message: string }>(`/eventconfigs/${id}`);
			return response.data;
		},

		// Trigger Event
		triggerEvent: async (data: TriggerEventRequest) => {
			const response = await this.flowLauncherClient.post<TriggerEventResponse>('/processor', data);
			return response.data;
		},
	};

	/**
	 * Email Service API Methods
	 */
	emailService = {
		// Campaigns
		listCampaigns: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<ListResponse<Campaign>>('/campaign', { params });
			return response.data;
		},

		getCampaign: async (id: string) => {
			const response = await this.emailServiceClient.get<Campaign>(`/campaign/${id}`);
			return response.data;
		},

		createCampaign: async (data: Partial<Campaign> & { user: string }) => {
			const response = await this.emailServiceClient.post<{ id: string }>('/campaign', data);
			return response.data;
		},

		updateCampaign: async (id: string, data: Partial<Campaign> & { user: string }) => {
			const response = await this.emailServiceClient.put<{ message: string }>(`/campaign/${id}`, data);
			return response.data;
		},

		deleteCampaign: async (id: string) => {
			const response = await this.emailServiceClient.delete<{ message: string }>(`/campaign/${id}`);
			return response.data;
		},

		countCampaigns: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<{ count: number }>('/campaign/count', { params });
			return response.data;
		},

		// Templates
		listTemplates: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<ListResponse<Template>>('/template', { params });
			return response.data;
		},

		getTemplate: async (id: string) => {
			const response = await this.emailServiceClient.get<Template>(`/template/${id}`);
			return response.data;
		},

		createTemplate: async (data: Partial<Template> & { user: string }) => {
			const response = await this.emailServiceClient.post<{ id: string }>('/template', data);
			return response.data;
		},

		updateTemplate: async (id: string, data: Partial<Template> & { user: string }) => {
			const response = await this.emailServiceClient.put<{ message: string }>(`/template/${id}`, data);
			return response.data;
		},

		deleteTemplate: async (id: string) => {
			const response = await this.emailServiceClient.delete<{ message: string }>(`/template/${id}`);
			return response.data;
		},

		// Audiences
		listAudiences: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<ListResponse<Audience>>('/audience', { params });
			return response.data;
		},

		getAudience: async (id: string) => {
			const response = await this.emailServiceClient.get<Audience>(`/audience/${id}`);
			return response.data;
		},

		createAudience: async (data: Partial<Audience> & { user: string }) => {
			const response = await this.emailServiceClient.post<{ id: string }>('/audience', data);
			return response.data;
		},

		updateAudience: async (id: string, data: Partial<Audience> & { user: string }) => {
			const response = await this.emailServiceClient.put<{ message: string }>(`/audience/${id}`, data);
			return response.data;
		},

		deleteAudience: async (id: string) => {
			const response = await this.emailServiceClient.delete<{ message: string }>(`/audience/${id}`);
			return response.data;
		},

		// Audience Types
		listAudienceTypes: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<ListResponse<AudienceType>>('/audiencetype', { params });
			return response.data;
		},

		getAudienceType: async (id: string) => {
			const response = await this.emailServiceClient.get<AudienceType>(`/audiencetype/${id}`);
			return response.data;
		},

		createAudienceType: async (data: Partial<AudienceType> & { user: string }) => {
			const response = await this.emailServiceClient.post<{ id: string }>('/audiencetype', data);
			return response.data;
		},

		updateAudienceType: async (id: string, data: Partial<AudienceType> & { user: string }) => {
			const response = await this.emailServiceClient.put<{ message: string }>(`/audiencetype/${id}`, data);
			return response.data;
		},

		deleteAudienceType: async (id: string) => {
			const response = await this.emailServiceClient.delete<{ message: string }>(`/audiencetype/${id}`);
			return response.data;
		},

		// Senders
		listSenders: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<ListResponse<Sender>>('/senders', { params });
			return response.data;
		},

		getSender: async (id: string) => {
			const response = await this.emailServiceClient.get<Sender>(`/senders/${id}`);
			return response.data;
		},

		createSender: async (data: Partial<Sender> & { user: string }) => {
			const response = await this.emailServiceClient.post<{ id: string }>('/senders', data);
			return response.data;
		},

		updateSender: async (id: string, data: Partial<Sender> & { user: string }) => {
			const response = await this.emailServiceClient.put<{ message: string }>(`/senders/${id}`, data);
			return response.data;
		},

		deleteSender: async (id: string) => {
			const response = await this.emailServiceClient.delete<{ message: string }>(`/senders/${id}`);
			return response.data;
		},

		// Settings
		listSettings: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<ListResponse<Setting>>('/settings', { params });
			return response.data;
		},

		getSetting: async (id: string) => {
			const response = await this.emailServiceClient.get<Setting>(`/settings/${id}`);
			return response.data;
		},

		updateSetting: async (id: string, data: Partial<Setting> & { user: string }) => {
			const response = await this.emailServiceClient.put<{ message: string }>(`/settings/${id}`, data);
			return response.data;
		},

		// Unsubscribes
		listUnsubscribes: async (params?: ListParams) => {
			const response = await this.emailServiceClient.get<ListResponse<Unsubscribe>>('/unsubscribe-data', { params });
			return response.data;
		},

		removeUnsubscribe: async (email: string, emailType: string) => {
			const response = await this.emailServiceClient.delete<{ message: string }>(`/unsubscribe-data/${email}/${emailType}`);
			return response.data;
		},

		// Status
		getSESStatus: async () => {
			const response = await this.emailServiceClient.get<SESStatusResponse>('/status');
			return response.data;
		},
	};

	/**
	 * AWS SSO API Methods
	 */
	awsSso = {
		getStatus: async () => {
			const response = await this.awsSsoClient.get<AwsSsoStatus>(apiConfig.awsSso.endpoints.status);
			return response.data;
		},

		login: async (data: AwsSsoLoginRequest) => {
			const response = await this.awsSsoClient.post<AwsSsoLoginResponse>(apiConfig.awsSso.endpoints.login, data);
			return response.data;
		},

		logout: async () => {
			const response = await this.awsSsoClient.post<{ success: boolean }>(apiConfig.awsSso.endpoints.logout);
			return response.data;
		},
	};
}

/**
 * Export singleton instance
 */
export const apiClient = new UnifiedApiClient();

/**
 * Export types
 */
export type { Audience, AudienceType, AwsSsoLoginRequest, AwsSsoLoginResponse, AwsSsoStatus, Campaign, DescribeStateMachineResponse, EventConfig, ExecuteFlowRequest, ExecuteFlowResponse, FlowLauncherEvent, FlowLauncherFlow, ListParams, ListResponse, Sender, SESStatusResponse, Setting, StateMachine, StateMachineExecution, Template, TriggerEventRequest, TriggerEventResponse, Unsubscribe };
