export type Environment = 'asr-prod' | 'asr-staging' | 'jaimy-prod' | 'jaimy-staging';

export interface EnvironmentConfig {
	awsAccount: string;
	awsProfile: string;
	awsRegion: string;
	color: string;
	darkColor: string;
	displayName: string;
	flowLauncherApiKey: string;
	flowLauncherUrl: string;
	name: Environment;
}

export interface EnvironmentContextType {
	config: EnvironmentConfig;
	environment: Environment;
	setEnvironment: (env: Environment) => void;
}
