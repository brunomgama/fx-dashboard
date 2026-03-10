import { useEmailService } from '@/components/providers/email-service-provider';
import { useMemo } from 'react';
import { emailServiceAPI } from '../api';

/**
 * Hook that returns an Email Service API client pre-configured with the current environment
 *
 * Usage:
 * const api = useEmailServiceAPI();
 * const campaigns = await api.listCampaigns({ limit: 10 }); // No config needed!
 */
export function useEmailServiceAPI() {
	const { environmentConfig } = useEmailService();

	// Map environmentConfig to the API config format
	const apiConfig = useMemo(
		() => ({
			apiUrl: environmentConfig.url,
			apiKey: environmentConfig.apiKey,
		}),
		[environmentConfig]
	);

	return useMemo(
		() => ({
			// Campaigns
			listCampaigns: (params?: Parameters<typeof emailServiceAPI.listCampaigns>[1]) => emailServiceAPI.listCampaigns(apiConfig, params),

			getCampaign: (id: string) => emailServiceAPI.getCampaign(apiConfig, id),

			createCampaign: (data: Parameters<typeof emailServiceAPI.createCampaign>[1]) => emailServiceAPI.createCampaign(apiConfig, data),

			updateCampaign: (id: string, data: Parameters<typeof emailServiceAPI.updateCampaign>[2]) => emailServiceAPI.updateCampaign(apiConfig, id, data),

			deleteCampaign: (id: string) => emailServiceAPI.deleteCampaign(apiConfig, id),

			countCampaigns: (params?: Parameters<typeof emailServiceAPI.countCampaigns>[1]) => emailServiceAPI.countCampaigns(apiConfig, params),

			// Templates
			listTemplates: (params?: Parameters<typeof emailServiceAPI.listTemplates>[1]) => emailServiceAPI.listTemplates(apiConfig, params),

			getTemplate: (id: string) => emailServiceAPI.getTemplate(apiConfig, id),

			createTemplate: (data: Parameters<typeof emailServiceAPI.createTemplate>[1]) => emailServiceAPI.createTemplate(apiConfig, data),

			updateTemplate: (id: string, data: Parameters<typeof emailServiceAPI.updateTemplate>[2]) => emailServiceAPI.updateTemplate(apiConfig, id, data),

			deleteTemplate: (id: string) => emailServiceAPI.deleteTemplate(apiConfig, id),

			// Audiences
			listAudiences: (params?: Parameters<typeof emailServiceAPI.listAudiences>[1]) => emailServiceAPI.listAudiences(apiConfig, params),

			getAudience: (id: string) => emailServiceAPI.getAudience(apiConfig, id),

			createAudience: (data: Parameters<typeof emailServiceAPI.createAudience>[1]) => emailServiceAPI.createAudience(apiConfig, data),

			updateAudience: (id: string, data: Parameters<typeof emailServiceAPI.updateAudience>[2]) => emailServiceAPI.updateAudience(apiConfig, id, data),

			deleteAudience: (id: string) => emailServiceAPI.deleteAudience(apiConfig, id),

			// Audience Types
			listAudienceTypes: (params?: Parameters<typeof emailServiceAPI.listAudienceTypes>[1]) => emailServiceAPI.listAudienceTypes(apiConfig, params),

			getAudienceType: (id: string) => emailServiceAPI.getAudienceType(apiConfig, id),

			createAudienceType: (data: Parameters<typeof emailServiceAPI.createAudienceType>[1]) => emailServiceAPI.createAudienceType(apiConfig, data),

			updateAudienceType: (id: string, data: Parameters<typeof emailServiceAPI.updateAudienceType>[2]) => emailServiceAPI.updateAudienceType(apiConfig, id, data),

			deleteAudienceType: (id: string) => emailServiceAPI.deleteAudienceType(apiConfig, id),

			// Senders
			listSenders: (params?: Parameters<typeof emailServiceAPI.listSenders>[1]) => emailServiceAPI.listSenders(apiConfig, params),

			getSender: (id: string) => emailServiceAPI.getSender(apiConfig, id),

			createSender: (data: Parameters<typeof emailServiceAPI.createSender>[1]) => emailServiceAPI.createSender(apiConfig, data),

			updateSender: (id: string, data: Parameters<typeof emailServiceAPI.updateSender>[2]) => emailServiceAPI.updateSender(apiConfig, id, data),

			deleteSender: (id: string) => emailServiceAPI.deleteSender(apiConfig, id),

			// Settings
			listSettings: (params?: Parameters<typeof emailServiceAPI.listSettings>[1]) => emailServiceAPI.listSettings(apiConfig, params),

			getSetting: (id: string) => emailServiceAPI.getSetting(apiConfig, id),

			updateSetting: (id: string, data: Parameters<typeof emailServiceAPI.updateSetting>[2]) => emailServiceAPI.updateSetting(apiConfig, id, data),

			// Unsubscribes
			listUnsubscribes: (params?: Parameters<typeof emailServiceAPI.listUnsubscribes>[1]) => emailServiceAPI.listUnsubscribes(apiConfig, params),

			removeUnsubscribe: (email: string, emailType: string) => emailServiceAPI.removeUnsubscribe(apiConfig, email, emailType),

			// Status
			getSESStatus: () => emailServiceAPI.getSESStatus(apiConfig),
		}),
		[apiConfig]
	);
}
