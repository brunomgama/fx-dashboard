'use client';

import { useEnvironment } from './environment-provider';

export function useEmailService() {
	const { environment, setEnvironment, config } = useEnvironment();
	
	return {
		environment,
		setEnvironment,
		environmentConfig: {
			name: config.name,
			displayName: config.displayName,
			apiUrl: config.emailServiceUrl,
			apiKey: config.emailServiceApiKey,
			region: config.region,
			awsProfile: config.awsProfile,
		},
	};
}

// Keep the EmailServiceProvider for backward compatibility but make it do nothing
export function EmailServiceProvider({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
