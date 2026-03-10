import { Audience, AudienceType, Campaign, ListParams, ListResponse, SESStatusResponse, Sender, Setting, Template, Unsubscribe } from '../types';

interface EmailEnvironmentConfig {
	apiUrl: string;
	apiKey: string;
}

class EmailServiceAPI {
	private async makeRequest<T>(config: EmailEnvironmentConfig, endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${config.apiUrl}${endpoint}`;

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

	// Helper to build query string from params
	private buildQueryString(params?: ListParams): string {
		if (!params || Object.keys(params).length === 0) return '';
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});
		return `?${searchParams.toString()}`;
	}

	// ==================== CAMPAIGNS ====================
	async listCampaigns(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<ListResponse<Campaign>>(config, `/campaign${queryString}`, {
			method: 'GET',
		});
	}

	async getCampaign(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<Campaign>(config, `/campaign/${id}`);
	}

	async createCampaign(config: EmailEnvironmentConfig, data: Partial<Campaign> & { user: string }) {
		return this.makeRequest<{ id: string }>(config, '/campaign', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateCampaign(config: EmailEnvironmentConfig, id: string, data: Partial<Campaign> & { user: string }) {
		return this.makeRequest<{ message: string }>(config, `/campaign/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteCampaign(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/campaign/${id}`, {
			method: 'DELETE',
		});
	}

	async countCampaigns(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<{ count: number }>(config, `/campaign/count${queryString}`, {
			method: 'GET',
		});
	}

	// ==================== TEMPLATES ====================
	async listTemplates(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<ListResponse<Template>>(config, `/template${queryString}`, {
			method: 'GET',
		});
	}

	async getTemplate(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<Template>(config, `/template/${id}`);
	}

	async createTemplate(config: EmailEnvironmentConfig, data: Partial<Template> & { user: string }) {
		return this.makeRequest<{ id: string }>(config, '/template', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateTemplate(config: EmailEnvironmentConfig, id: string, data: Partial<Template> & { user: string }) {
		return this.makeRequest<{ message: string }>(config, `/template/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteTemplate(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/template/${id}`, {
			method: 'DELETE',
		});
	}

	// ==================== AUDIENCES ====================
	async listAudiences(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<ListResponse<Audience>>(config, `/audience${queryString}`, {
			method: 'GET',
		});
	}

	async getAudience(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<Audience>(config, `/audience/${id}`);
	}

	async createAudience(config: EmailEnvironmentConfig, data: Partial<Audience> & { user: string }) {
		return this.makeRequest<{ id: string }>(config, '/audience', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateAudience(config: EmailEnvironmentConfig, id: string, data: Partial<Audience> & { user: string }) {
		return this.makeRequest<{ message: string }>(config, `/audience/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteAudience(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/audience/${id}`, {
			method: 'DELETE',
		});
	}

	// ==================== AUDIENCE TYPES ====================
	async listAudienceTypes(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<ListResponse<AudienceType>>(config, `/audiencetype${queryString}`, {
			method: 'GET',
		});
	}

	async getAudienceType(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<AudienceType>(config, `/audiencetype/${id}`);
	}

	async createAudienceType(config: EmailEnvironmentConfig, data: Partial<AudienceType> & { user: string }) {
		return this.makeRequest<{ id: string }>(config, '/audiencetype', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateAudienceType(config: EmailEnvironmentConfig, id: string, data: Partial<AudienceType> & { user: string }) {
		return this.makeRequest<{ message: string }>(config, `/audiencetype/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteAudienceType(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/audiencetype/${id}`, {
			method: 'DELETE',
		});
	}

	// ==================== SENDERS ====================
	async listSenders(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<ListResponse<Sender>>(config, `/senders${queryString}`, {
			method: 'GET',
		});
	}

	async getSender(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<Sender>(config, `/senders/${id}`);
	}

	async createSender(config: EmailEnvironmentConfig, data: Partial<Sender> & { user: string }) {
		return this.makeRequest<{ id: string }>(config, '/senders', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async updateSender(config: EmailEnvironmentConfig, id: string, data: Partial<Sender> & { user: string }) {
		return this.makeRequest<{ message: string }>(config, `/senders/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async deleteSender(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<{ message: string }>(config, `/senders/${id}`, {
			method: 'DELETE',
		});
	}

	// ==================== SETTINGS ====================
	async listSettings(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<ListResponse<Setting>>(config, `/settings${queryString}`, {
			method: 'GET',
		});
	}

	async getSetting(config: EmailEnvironmentConfig, id: string) {
		return this.makeRequest<Setting>(config, `/settings/${id}`);
	}

	async updateSetting(config: EmailEnvironmentConfig, id: string, data: Partial<Setting> & { user: string }) {
		return this.makeRequest<{ message: string }>(config, `/settings/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	// ==================== UNSUBSCRIBES ====================
	async listUnsubscribes(config: EmailEnvironmentConfig, params?: ListParams) {
		const queryString = this.buildQueryString(params);
		return this.makeRequest<ListResponse<Unsubscribe>>(config, `/unsubscribe-data${queryString}`, {
			method: 'GET',
		});
	}

	async removeUnsubscribe(config: EmailEnvironmentConfig, email: string, emailType: string) {
		return this.makeRequest<{ message: string }>(config, `/unsubscribe-data/${email}/${emailType}`, {
			method: 'DELETE',
		});
	}

	// ==================== STATUS ====================
	async getSESStatus(config: EmailEnvironmentConfig) {
		return this.makeRequest<SESStatusResponse>(config, '/status');
	}
}

export const emailServiceAPI = new EmailServiceAPI();
