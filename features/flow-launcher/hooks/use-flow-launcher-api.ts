import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { useMemo } from 'react';
import { flowLauncherAPI } from '../api';

/**
 * Hook that returns a Flow Launcher API client pre-configured with the current environment
 *
 * Usage:
 * const api = useFlowLauncherAPI();
 * const flows = await api.listFlows({ limit: 10 }); // No config needed!
 */
export function useFlowLauncherAPI() {
	const { environmentConfig } = useFlowLauncher();

	return useMemo(
		() => ({
			// Flows
			listFlows: (params?: { limit?: number; sortBy?: string; sortOrder?: string }) => flowLauncherAPI.listFlows(environmentConfig, params),

			getFlow: (id: string) => flowLauncherAPI.getFlow(environmentConfig, id),

			createFlow: (data: Parameters<typeof flowLauncherAPI.createFlow>[1]) => flowLauncherAPI.createFlow(environmentConfig, data),

			updateFlow: (id: string, data: Parameters<typeof flowLauncherAPI.updateFlow>[2]) => flowLauncherAPI.updateFlow(environmentConfig, id, data),

			deleteFlow: (id: string) => flowLauncherAPI.deleteFlow(environmentConfig, id),

			// Events
			listEvents: (params?: { limit?: number }) => flowLauncherAPI.listEvents(environmentConfig, params),

			getEvent: (id: string) => flowLauncherAPI.getEvent(environmentConfig, id),

			createEvent: (data: Parameters<typeof flowLauncherAPI.createEvent>[1]) => flowLauncherAPI.createEvent(environmentConfig, data),

			updateEvent: (id: string, data: Parameters<typeof flowLauncherAPI.updateEvent>[2]) => flowLauncherAPI.updateEvent(environmentConfig, id, data),

			deleteEvent: (id: string) => flowLauncherAPI.deleteEvent(environmentConfig, id),

			// Event Configs
			listEventConfigs: (params?: { limit?: number }) => flowLauncherAPI.listEventConfigs(environmentConfig, params),

			getEventConfig: (id: string) => flowLauncherAPI.getEventConfig(environmentConfig, id),

			createEventConfig: (data: Parameters<typeof flowLauncherAPI.createEventConfig>[1]) => flowLauncherAPI.createEventConfig(environmentConfig, data),

			updateEventConfig: (id: string, data: Parameters<typeof flowLauncherAPI.updateEventConfig>[2]) => flowLauncherAPI.updateEventConfig(environmentConfig, id, data),

			deleteEventConfig: (id: string) => flowLauncherAPI.deleteEventConfig(environmentConfig, id),

			// Processor
			triggerEvent: (data: Parameters<typeof flowLauncherAPI.triggerEvent>[1]) => flowLauncherAPI.triggerEvent(environmentConfig, data),
		}),
		[environmentConfig]
	);
}
