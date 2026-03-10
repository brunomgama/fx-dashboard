import { CreateEventConfigRequest, CreateEventRequest, CreateFlowRequest, Event, EventConfig, Flow, ListResponse, TriggerEventRequest, TriggerEventResponse, UpdateEventConfigRequest, UpdateEventRequest, UpdateFlowRequest } from '@/types/flow-launcher';

interface FlowLauncherConfig {
	url: string;
	apiKey: string;
}

class FlowLauncherAPI {
	private async makeRequest<T>(config: FlowLauncherConfig, endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${config.url}${endpoint}`;

		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.apiKey,
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: response.statusText }));
			throw new Error(error.error || error.message || 'API request failed');
		}

		const text = await response.text();
		if (!text) return {} as T;
		try {
			return JSON.parse(text);
		} catch {
			return text as unknown as T;
		}
	}

	// ==================== FLOWS ====================

	async listFlows(config: FlowLauncherConfig, params?: { limit?: number; sortBy?: string; sortOrder?: string }) {
		const queryParams = new URLSearchParams();
		if (params?.limit) queryParams.append('limit', params.limit.toString());
		if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
		if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

		const endpoint = `/flows${queryParams.toString() ? `?${queryParams}` : ''}`;
		return this.makeRequest<ListResponse<Flow>>(config, endpoint);
	}

	async getFlow(config: FlowLauncherConfig, id: string) {
		return this.makeRequest<Flow>(config, `/flows/${id}`);
	}

	async createFlow(config: FlowLauncherConfig, data: CreateFlowRequest) {
		return this.makeRequest<Flow>(config, '/flows', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateFlow(config: FlowLauncherConfig, id: string, data: UpdateFlowRequest) {
		return this.makeRequest<Flow>(config, `/flows/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteFlow(config: FlowLauncherConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/flows/${id}`, {
			method: 'DELETE',
		});
	}

	// ==================== EVENTS ====================

	async listEvents(config: FlowLauncherConfig, params?: { limit?: number }) {
		const queryParams = new URLSearchParams();
		if (params?.limit) queryParams.append('limit', params.limit.toString());

		const endpoint = `/events${queryParams.toString() ? `?${queryParams}` : ''}`;
		return this.makeRequest<ListResponse<Event>>(config, endpoint);
	}

	async getEvent(config: FlowLauncherConfig, id: string) {
		return this.makeRequest<Event>(config, `/events/${id}`);
	}

	async createEvent(config: FlowLauncherConfig, data: CreateEventRequest) {
		return this.makeRequest<Event>(config, '/events', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateEvent(config: FlowLauncherConfig, id: string, data: UpdateEventRequest) {
		return this.makeRequest<Event>(config, `/events/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteEvent(config: FlowLauncherConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/events/${id}`, {
			method: 'DELETE',
		});
	}

	// ==================== EVENT CONFIGS ====================

	async listEventConfigs(config: FlowLauncherConfig, params?: { limit?: number }) {
		const queryParams = new URLSearchParams();
		if (params?.limit) queryParams.append('limit', params.limit.toString());

		const endpoint = `/eventconfigs${queryParams.toString() ? `?${queryParams}` : ''}`;
		return this.makeRequest<ListResponse<EventConfig>>(config, endpoint);
	}

	async getEventConfig(config: FlowLauncherConfig, id: string) {
		return this.makeRequest<EventConfig>(config, `/eventconfigs/${id}`);
	}

	async createEventConfig(config: FlowLauncherConfig, data: CreateEventConfigRequest) {
		return this.makeRequest<EventConfig>(config, '/eventconfigs', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateEventConfig(config: FlowLauncherConfig, id: string, data: UpdateEventConfigRequest) {
		return this.makeRequest<EventConfig>(config, `/eventconfigs/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteEventConfig(config: FlowLauncherConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/eventconfigs/${id}`, {
			method: 'DELETE',
		});
	}

	// ==================== PROCESSOR ====================

	async triggerEvent(config: FlowLauncherConfig, data: TriggerEventRequest) {
		return this.makeRequest<TriggerEventResponse>(config, '/processor', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}
}

export const flowLauncherAPI = new FlowLauncherAPI();
