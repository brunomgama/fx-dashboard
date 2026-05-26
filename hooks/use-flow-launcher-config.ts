import { useEnvironment } from '@/components/providers/environment-provider';

export function useFlowLauncherConfig() {
	const { config, environment } = useEnvironment();
	return {
		awsProfile: config.awsProfile,
		awsRegion: config.awsRegion,
		environment,
	};
}
