export type Environment = 'jaimy-staging' | 'jaimy-prod' | 'asr-staging' | 'asr-prod';

export interface EnvironmentConfig {
	name: Environment;
	displayName: string;
	account: string;
	region: string;
	awsProfile: string;
	color: string;
	darkColor: string;
	flowLauncher: { url: string; apiKey: string };
	emailService: { url: string; apiKey: string };
}

export interface EnvironmentContextType {
	environment: Environment;
	config: EnvironmentConfig;
	setEnvironment: (env: Environment) => void;
}
