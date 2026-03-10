'use client';

import { useEnvironment } from './environment-provider';

export function useFlowLauncher() {
	const { environment, setEnvironment, config } = useEnvironment();

	return {
		environment,
		setEnvironment,
		// Return the flow launcher config from centralized environment
		environmentConfig: config.flowLauncher,
		// Also expose the full config for UI needs (colors, display name, etc.)
		fullConfig: config,
	};
}

// Keep the FlowLauncherProvider for backward compatibility but make it do nothing
export function FlowLauncherProvider({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
