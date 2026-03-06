import { EnvironmentConfig, FlowLauncherEnvironment } from '@/types/flow-launcher';

interface EnvironmentConfigWithColor extends EnvironmentConfig {
	color: string;
	darkColor: string;
}

export const FLOW_LAUNCHER_ENVIRONMENTS: Record<FlowLauncherEnvironment, EnvironmentConfigWithColor> = {
	'jaimy-staging': {
		name: 'jaimy-staging',
		displayName: 'Jaimy Staging',
		url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_URL || '',
		apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_API_KEY || '',
		account: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_REGION || '',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_PROFILE || '',
		color: 'bg-blue-200 hover:bg-blue-300',
		darkColor: 'dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
	},
	'jaimy-prod': {
		name: 'jaimy-prod',
		displayName: 'Jaimy Production',
		url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_URL || '',
		apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_API_KEY || '',
		account: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_REGION || '',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_PROFILE || '',
		color: 'bg-red-200 hover:bg-red-300',
		darkColor: 'dark:bg-red-900/30 dark:hover:bg-red-900/50',
	},
	'asr-staging': {
		name: 'asr-staging',
		displayName: 'ASR Staging',
		url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_URL || '',
		apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_API_KEY || '',
		account: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_REGION || '',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_PROFILE || '',
		color: 'bg-green-200 hover:bg-green-300',
		darkColor: 'dark:bg-green-900/30 dark:hover:bg-green-900/50',
	},
	'asr-prod': {
		name: 'asr-prod',
		displayName: 'ASR Production',
		url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_URL || '',
		apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_API_KEY || '',
		account: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_REGION || '',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_PROFILE || '',
		color: 'bg-yellow-200 hover:bg-yellow-300',
		darkColor: 'dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50',
	},
};

export const DEFAULT_ENVIRONMENT: FlowLauncherEnvironment = 'jaimy-staging';
