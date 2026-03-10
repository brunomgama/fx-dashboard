import type { CreateEventConfigRequest, CreateEventRequest, CreateFlowRequest, Event, EventConfig, Flow, ListResponse, TriggerEventRequest, TriggerEventResponse, UpdateEventConfigRequest, UpdateEventRequest, UpdateFlowRequest } from './types';

interface FlowLauncherConfig {
	url: string;
	apiKey: string;
}

async function request<T>(config: FlowLauncherConfig, endpoint: string, options: RequestInit = {}): Promise<T> {
	const res = await fetch(`${config.url}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': config.apiKey,
			...options.headers,
		},
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: res.statusText }));
		throw new Error(err.error || err.message || 'API request failed');
	}

	const text = await res.text();
	if (!text) return {} as T;
	return JSON.parse(text);
}

function buildQuery(params: Record<string, string | number | undefined>) {
	const q = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => v !== undefined && q.append(k, String(v)));
	const s = q.toString();
	return s ? `?${s}` : '';
}

// ─── Flows ────────────────────────────────────────────────────────────────────

export const flowsApi = {
	list: (cfg: FlowLauncherConfig, params?: { limit?: number }) => request<ListResponse<Flow>>(cfg, `/flows${buildQuery({ limit: params?.limit })}`),

	get: (cfg: FlowLauncherConfig, id: string) => request<Flow>(cfg, `/flows/${id}`),

	create: (cfg: FlowLauncherConfig, data: CreateFlowRequest) => request<Flow>(cfg, '/flows', { method: 'POST', body: JSON.stringify(data) }),

	update: (cfg: FlowLauncherConfig, id: string, data: UpdateFlowRequest) => request<Flow>(cfg, `/flows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

	delete: (cfg: FlowLauncherConfig, id: string) => request<{ message: string }>(cfg, `/flows/${id}`, { method: 'DELETE' }),
};

// ─── Events ───────────────────────────────────────────────────────────────────

export const eventsApi = {
	list: (cfg: FlowLauncherConfig, params?: { limit?: number }) => request<ListResponse<Event>>(cfg, `/events${buildQuery({ limit: params?.limit })}`),

	get: (cfg: FlowLauncherConfig, id: string) => request<Event>(cfg, `/events/${id}`),

	create: (cfg: FlowLauncherConfig, data: CreateEventRequest) => request<Event>(cfg, '/events', { method: 'POST', body: JSON.stringify(data) }),

	update: (cfg: FlowLauncherConfig, id: string, data: UpdateEventRequest) => request<Event>(cfg, `/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

	delete: (cfg: FlowLauncherConfig, id: string) => request<{ message: string }>(cfg, `/events/${id}`, { method: 'DELETE' }),

	trigger: (cfg: FlowLauncherConfig, data: TriggerEventRequest) => request<TriggerEventResponse>(cfg, '/processor', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Event Configs ────────────────────────────────────────────────────────────

export const eventConfigsApi = {
	list: (cfg: FlowLauncherConfig, params?: { limit?: number }) => request<ListResponse<EventConfig>>(cfg, `/eventconfigs${buildQuery({ limit: params?.limit })}`),

	get: (cfg: FlowLauncherConfig, id: string) => request<EventConfig>(cfg, `/eventconfigs/${id}`),

	create: (cfg: FlowLauncherConfig, data: CreateEventConfigRequest) => request<EventConfig>(cfg, '/eventconfigs', { method: 'POST', body: JSON.stringify(data) }),

	update: (cfg: FlowLauncherConfig, id: string, data: UpdateEventConfigRequest) => request<EventConfig>(cfg, `/eventconfigs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

	delete: (cfg: FlowLauncherConfig, id: string) => request<{ message: string }>(cfg, `/eventconfigs/${id}`, { method: 'DELETE' }),
};
