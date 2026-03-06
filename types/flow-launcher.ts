export type FlowLauncherEnvironment = 'jaimy-staging' | 'jaimy-prod' | 'asr-staging' | 'asr-prod';

export interface EnvironmentConfig {
	name: string;
	displayName: string;
	url: string;
	apiKey: string;
	account: string;
	region: string;
	awsProfile: string;
	color: string;
	darkColor: string;
}

export interface Flow {
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

export interface Event {
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
	items?: T[];
	Items?: T[];
	results?: T[];
	count?: number;
	lastEvaluatedKey?: string;
}

export interface CreateFlowRequest {
	user: string;
	name: string;
	arn: string;
	description: string;
	input: string;
	variables: string[];
}

export interface UpdateFlowRequest {
	user: string;
	name?: string;
	arn?: string;
	description?: string;
	input?: string;
	variables?: string[];
}

export interface CreateEventRequest {
	user: string;
	name: string;
}

export interface UpdateEventRequest {
	user: string;
	name?: string;
	description?: string;
	flow_ids?: string[];
	input?: string;
	variables?: string[];
}

export interface CreateEventConfigRequest {
	user: string;
	id: string;
	defaults: string;
}

export interface UpdateEventConfigRequest {
	user: string;
	defaults: string;
}

export interface ASLChoice {
	Next?: string;
	[key: string]: unknown;
}

export interface ASLCatch {
	Next?: string;
	ErrorEquals?: string[];
}

export interface ASLState {
	Type?: string;
	Next?: string;
	Resource?: string;
	Default?: string;
	Choices?: ASLChoice[];
	Catch?: ASLCatch[];
	End?: boolean;
	[key: string]: unknown;
}

export interface ASLDefinition {
	StartAt: string;
	States: Record<string, ASLState>;
}

export interface StateColor {
	bg: string;
	border: string;
	text: string;
}

export const STATE_COLORS: Record<string, StateColor> = {
	Task: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
	Choice: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
	Wait: { bg: '#ede9fe', border: '#8b5cf6', text: '#4c1d95' },
	Pass: { bg: '#f3f4f6', border: '#9ca3af', text: '#374151' },
	Succeed: { bg: '#dcfce7', border: '#22c55e', text: '#14532d' },
	Fail: { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d' },
	Map: { bg: '#cffafe', border: '#06b6d4', text: '#164e63' },
	Parallel: { bg: '#e0e7ff', border: '#6366f1', text: '#312e81' },
};
