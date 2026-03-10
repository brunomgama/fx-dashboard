import type { Environment, EnvironmentConfig } from './types';

export const ENVIRONMENTS: Record<Environment, EnvironmentConfig> = {
	'jaimy-staging': {
		name: 'jaimy-staging',
		displayName: 'Jaimy Staging',
		account: process.env.NEXT_PUBLIC_JAIMY_STAGING_ACCOUNT || '058264364375',
		region: process.env.NEXT_PUBLIC_JAIMY_STAGING_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_JAIMY_STAGING_PROFILE || 'fixxer-administrator-058264364375',
		color: 'bg-blue-200 hover:bg-blue-300',
		darkColor: 'dark:bg-blue-900/30 dark:hover:bg-blue-900/50',
		flowLauncher: {
			url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_URL || '',
			apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_API_KEY || '',
		},
		emailService: {
			url: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_STAGING_URL || '',
			apiKey: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_STAGING_KEY || '',
		},
	},
	'jaimy-prod': {
		name: 'jaimy-prod',
		displayName: 'Jaimy Production',
		account: process.env.NEXT_PUBLIC_JAIMY_PROD_ACCOUNT || '905418010637',
		region: process.env.NEXT_PUBLIC_JAIMY_PROD_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_JAIMY_PROD_PROFILE || 'fixxer-administrator-905418010637',
		color: 'bg-red-200 hover:bg-red-300',
		darkColor: 'dark:bg-red-900/30 dark:hover:bg-red-900/50',
		flowLauncher: {
			url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_URL || '',
			apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_API_KEY || '',
		},
		emailService: {
			url: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_PROD_URL || '',
			apiKey: process.env.NEXT_PUBLIC_EMAIL_API_JAIMY_PROD_KEY || '',
		},
	},
	'asr-staging': {
		name: 'asr-staging',
		displayName: 'ASR Staging',
		account: process.env.NEXT_PUBLIC_ASR_STAGING_ACCOUNT || '058264364375',
		region: process.env.NEXT_PUBLIC_ASR_STAGING_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_ASR_STAGING_PROFILE || 'fixxer-administrator-058264364375',
		color: 'bg-green-200 hover:bg-green-300',
		darkColor: 'dark:bg-green-900/30 dark:hover:bg-green-900/50',
		flowLauncher: {
			url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_URL || '',
			apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_API_KEY || '',
		},
		emailService: {
			url: process.env.NEXT_PUBLIC_EMAIL_API_ASR_STAGING_URL || '',
			apiKey: process.env.NEXT_PUBLIC_EMAIL_API_ASR_STAGING_KEY || '',
		},
	},
	'asr-prod': {
		name: 'asr-prod',
		displayName: 'ASR Production',
		account: process.env.NEXT_PUBLIC_ASR_PROD_ACCOUNT || '905418010637',
		region: process.env.NEXT_PUBLIC_ASR_PROD_REGION || 'eu-central-1',
		awsProfile: process.env.NEXT_PUBLIC_ASR_PROD_PROFILE || 'fixxer-administrator-905418010637',
		color: 'bg-yellow-200 hover:bg-yellow-300',
		darkColor: 'dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50',
		flowLauncher: {
			url: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_URL || '',
			apiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_API_KEY || '',
		},
		emailService: {
			url: process.env.NEXT_PUBLIC_EMAIL_API_ASR_PROD_URL || '',
			apiKey: process.env.NEXT_PUBLIC_EMAIL_API_ASR_PROD_KEY || '',
		},
	},
};

export const DEFAULT_ENVIRONMENT: Environment = 'jaimy-staging';
