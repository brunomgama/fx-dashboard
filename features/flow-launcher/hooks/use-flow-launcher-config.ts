import { useEnvironment } from '@/components/providers/environment-provider';

export function useFlowLauncherConfig() {
	const { config } = useEnvironment();
	return {
		apiConfig: config.flowLauncher,
		envConfig: config,
	};
}
