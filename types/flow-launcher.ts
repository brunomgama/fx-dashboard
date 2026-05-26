export interface ListResponse<T> {
	Items?: T[];
	items?: T[];
	results?: T[];
}

export interface Flow {
	arn: string;
	created_at?: string;
	description?: string;
	id: string;
	name: string;
	updated_at?: string;
	variables?: string[];
}

export interface FlowEvent {
	created_at?: string;
	description?: string;
	flow_ids?: string[];
	id: string;
	input?: string;
	name: string;
	variables?: string[];
}

export interface EventConfig {
	defaults?: string;
	id: string;
}

export interface CreateFlowRequest {
	arn: string;
	description?: string;
	name: string;
	user: string;
	variables?: string[];
}

export interface UpdateFlowRequest {
	description?: string;
	name?: string;
	user: string;
}

export interface CreateEventRequest {
	description?: string;
	name: string;
	user: string;
}

export interface UpdateEventRequest {
	description?: string;
	flow_ids?: string[];
	input?: string;
	user: string;
}

export interface CreateEventConfigRequest {
	defaults: string;
	id: string;
	user: string;
}

export interface UpdateEventConfigRequest {
	defaults: string;
	user: string;
}

export interface TriggerEventRequest {
	id: string;
	input?: Record<string, string>;
}

export interface TriggerEventResponse {
	executionArn?: string;
	message?: string;
}

export interface ASLState {
	Catch?: ASLCatch[];
	Choices?: ASLChoice[];
	Default?: string;
	End?: boolean;
	Next?: string;
	Resource?: string;
	Type: string;
}

export interface ASLChoice {
	Next?: string;
}

export interface ASLCatch {
	Next?: string;
}

export interface ASLDefinition {
	StartAt: string;
	States: Record<string, ASLState>;
}

export const STATE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
	Choice: { bg: '#fef9c3', border: '#eab308', text: '#854d0e' },
	Fail: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
	Map: { bg: '#e0f2fe', border: '#0ea5e9', text: '#0369a1' },
	Parallel: { bg: '#ffedd5', border: '#f97316', text: '#c2410c' },
	Pass: { bg: '#f1f5f9', border: '#94a3b8', text: '#475569' },
	Succeed: { bg: '#dcfce7', border: '#22c55e', text: '#15803d' },
	Task: { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
	Wait: { bg: '#f3e8ff', border: '#a855f7', text: '#7e22ce' },
};
