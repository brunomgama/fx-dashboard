import { ENVIRONMENTS } from '@/config/environments';
import type { Environment } from '@/types/environment';
import type {
	CreateEventConfigRequest,
	CreateEventRequest,
	CreateFlowRequest,
	EventConfig,
	Flow,
	FlowEvent,
	ListResponse,
	TriggerEventRequest,
	TriggerEventResponse,
	UpdateEventConfigRequest,
	UpdateEventRequest,
	UpdateFlowRequest,
} from '@/types/flow-launcher';

interface RequestInput {
	endpoint: string;
	environment: Environment;
	options?: RequestInit;
}

async function request<T>({ endpoint, environment, options = {} }: RequestInput): Promise<T> {
	const config = ENVIRONMENTS[environment];
	const res = await fetch(`${config.flowLauncherUrl}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': config.flowLauncherApiKey,
			...options.headers,
		},
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string; message?: string };
		throw new Error(err.error ?? err.message ?? 'API request failed');
	}

	const text = await res.text();
	if (!text) return {} as T;
	return JSON.parse(text) as T;
}

export function listFlows(environment: Environment) {
	return request<ListResponse<Flow>>({ endpoint: '/flows?limit=100', environment });
}

export function getFlow({ environment, id }: { environment: Environment; id: string }) {
	return request<Flow>({ endpoint: `/flows/${id}`, environment });
}

export function createFlow({ data, environment }: { data: CreateFlowRequest; environment: Environment }) {
	return request<Flow>({ endpoint: '/flows', environment, options: { body: JSON.stringify(data), method: 'POST' } });
}

export function updateFlow({ data, environment, id }: { data: UpdateFlowRequest; environment: Environment; id: string }) {
	return request<Flow>({ endpoint: `/flows/${id}`, environment, options: { body: JSON.stringify(data), method: 'PUT' } });
}

export function deleteFlow({ environment, id }: { environment: Environment; id: string }) {
	return request<{ message: string }>({ endpoint: `/flows/${id}`, environment, options: { method: 'DELETE' } });
}

export function listEvents(environment: Environment) {
	return request<ListResponse<FlowEvent>>({ endpoint: '/events?limit=100', environment });
}

export function getEvent({ environment, id }: { environment: Environment; id: string }) {
	return request<FlowEvent>({ endpoint: `/events/${id}`, environment });
}

export function createEvent({ data, environment }: { data: CreateEventRequest; environment: Environment }) {
	return request<FlowEvent>({ endpoint: '/events', environment, options: { body: JSON.stringify(data), method: 'POST' } });
}

export function updateEvent({ data, environment, id }: { data: UpdateEventRequest; environment: Environment; id: string }) {
	return request<FlowEvent>({ endpoint: `/events/${id}`, environment, options: { body: JSON.stringify(data), method: 'PUT' } });
}

export function deleteEvent({ environment, id }: { environment: Environment; id: string }) {
	return request<{ message: string }>({ endpoint: `/events/${id}`, environment, options: { method: 'DELETE' } });
}

export function triggerEvent({ data, environment }: { data: TriggerEventRequest; environment: Environment }) {
	return request<TriggerEventResponse>({ endpoint: '/processor', environment, options: { body: JSON.stringify(data), method: 'POST' } });
}

export function listEventConfigs(environment: Environment) {
	return request<ListResponse<EventConfig>>({ endpoint: '/eventconfigs?limit=100', environment });
}

export function getEventConfig({ environment, id }: { environment: Environment; id: string }) {
	return request<EventConfig>({ endpoint: `/eventconfigs/${id}`, environment });
}

export function createEventConfig({ data, environment }: { data: CreateEventConfigRequest; environment: Environment }) {
	return request<EventConfig>({ endpoint: '/eventconfigs', environment, options: { body: JSON.stringify(data), method: 'POST' } });
}

export function updateEventConfig({ data, environment, id }: { data: UpdateEventConfigRequest; environment: Environment; id: string }) {
	return request<EventConfig>({ endpoint: `/eventconfigs/${id}`, environment, options: { body: JSON.stringify(data), method: 'PUT' } });
}

export function deleteEventConfig({ environment, id }: { environment: Environment; id: string }) {
	return request<{ message: string }>({ endpoint: `/eventconfigs/${id}`, environment, options: { method: 'DELETE' } });
}
