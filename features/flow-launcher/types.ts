// ─── API Response Types ───────────────────────────────────────────────────────

export interface ListResponse<T> {
	results?: T[];
	items?: T[];
	Items?: T[];
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Flow {
	id: string;
	name: string;
	description?: string;
	arn: string;
	variables?: string[];
	created_at?: string;
	updated_at?: string;
}

export interface Event {
	id: string;
	name: string;
	description?: string;
	flow_ids?: string[];
	variables?: string[];
	input?: string;
	created_at?: string;
}

export interface EventConfig {
	id: string;
	defaults?: string;
}

// ─── Request Types ────────────────────────────────────────────────────────────

export interface CreateFlowRequest {
	user: string;
	name: string;
	description?: string;
	arn: string;
	variables?: string[];
}

export interface UpdateFlowRequest {
	user: string;
	name?: string;
	description?: string;
}

export interface CreateEventRequest {
	user: string;
	name: string;
	description?: string;
}

export interface UpdateEventRequest {
	user: string;
	description?: string;
	flow_ids?: string[];
	input?: string;
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

export interface TriggerEventRequest {
	id: string;
	input?: Record<string, string>;
}

export interface TriggerEventResponse {
	executionArn?: string;
	message?: string;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export const STATE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
	Task: { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
	Choice: { bg: '#fef9c3', border: '#eab308', text: '#854d0e' },
	Wait: { bg: '#f3e8ff', border: '#a855f7', text: '#7e22ce' },
	Succeed: { bg: '#dcfce7', border: '#22c55e', text: '#15803d' },
	Fail: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
	Parallel: { bg: '#ffedd5', border: '#f97316', text: '#c2410c' },
	Map: { bg: '#e0f2fe', border: '#0ea5e9', text: '#0369a1' },
	Pass: { bg: '#f1f5f9', border: '#94a3b8', text: '#475569' },
};

// ─── ASL Types ────────────────────────────────────────────────────────────────

export interface ASLState {
	Type: string;
	Next?: string;
	End?: boolean;
	Resource?: string;
	Choices?: ASLChoice[];
	Default?: string;
	Catch?: ASLCatch[];
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
