import { Environment, EnvironmentConfig } from '@/types/flow-launcher';

export const ENVIRONMENTS: Record<Environment, EnvironmentConfig> = {
	'jaimy-staging': {
		name: 'jaimy-staging',
		displayName: 'Jaimy Staging',
		// Flow Launcher
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_URL || '',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_API_KEY || '',
		// Email Service
		emailServiceUrl: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_STAGING_URL || 'https://j6k8o8m2o7.execute-api.eu-central-1.amazonaws.com/staging',
		emailServiceApiKey: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_STAGING_KEY || 'WzaiuJapd15YHXWMMmMZU3Af21W4NIlC8wJCYQ7R',
		// AWS Config
		account: process.env.NEXT_PUBLIC_JAIMY_STAGING_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_JAIMY_STAGING_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_JAIMY_STAGING_PROFILE || '',
		// UI
		color: 'bg-blue-200 hover:bg-blue-300',
		darkColor: 'dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
	},
	'jaimy-prod': {
		name: 'jaimy-prod',
		displayName: 'Jaimy Production',
		// Flow Launcher
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_URL || '',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_API_KEY || '',
		// Email Service
		emailServiceUrl: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_PROD_URL || 'https://ckqv3hnlkl.execute-api.eu-central-1.amazonaws.com/prod',
		emailServiceApiKey: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_PROD_KEY || 'WzaiuJapd15YHXWMMmMZU3Af21W4NIlC8wJCYQ7R',
		// AWS Config
		account: process.env.NEXT_PUBLIC_JAIMY_PROD_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_JAIMY_PROD_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_JAIMY_PROD_PROFILE || '',
		// UI
		color: 'bg-red-200 hover:bg-red-300',
		darkColor: 'dark:bg-red-900/30 dark:hover:bg-red-900/50',
	},
	'asr-staging': {
		name: 'asr-staging',
		displayName: 'ASR Staging',
		// Flow Launcher
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_URL || '',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_API_KEY || '',
		// Email Service
		emailServiceUrl: process.env.NEXT_PUBLIC_EMAIL_API_ASR_STAGING_URL || 'https://z82t5x0s1l.execute-api.eu-central-1.amazonaws.com/staging',
		emailServiceApiKey: process.env.NEXT_PUBLIC_EMAIL_API_ASR_STAGING_KEY || 'WzaiuJapd15YHXWMMmMZU3Af21W4NIlC8wJCYQ7R',
		// AWS Config
		account: process.env.NEXT_PUBLIC_ASR_STAGING_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_ASR_STAGING_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_ASR_STAGING_PROFILE || '',
		// UI
		color: 'bg-green-200 hover:bg-green-300',
		darkColor: 'dark:bg-green-900/30 dark:hover:bg-green-900/50',
	},
	'asr-prod': {
		name: 'asr-prod',
		displayName: 'ASR Production',
		// Flow Launcher
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_URL || '',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_API_KEY || '',
		// Email Service
		emailServiceUrl: process.env.NEXT_PUBLIC_EMAIL_API_ASR_PROD_URL || 'https://ckqv3hnlkl.execute-api.eu-central-1.amazonaws.com/prod',
		emailServiceApiKey: process.env.NEXT_PUBLIC_EMAIL_API_ASR_PROD_KEY || 'WzaiuJapd15YHXWMMmMZU3Af21W4NIlC8wJCYQ7R',
		// AWS Config
		account: process.env.NEXT_PUBLIC_ASR_PROD_ACCOUNT || '',
		region: process.env.NEXT_PUBLIC_ASR_PROD_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_ASR_PROD_PROFILE || '',
		// UI
		color: 'bg-yellow-200 hover:bg-yellow-300',
		darkColor: 'dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50',
	},
};

export const DEFAULT_ENVIRONMENT: Environment = 'jaimy-staging';
