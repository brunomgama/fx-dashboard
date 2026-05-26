import type { Environment, EnvironmentConfig } from '@/types/environment';

export const DEFAULT_ENVIRONMENT: Environment = 'jaimy-staging';

export const ENVIRONMENTS: Record<Environment, EnvironmentConfig> = {
	'asr-prod': {
		awsAccount: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_ACCOUNT ?? '939550027044',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_PROFILE ?? 'fixxer-administrator-939550027044',
		awsRegion: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_REGION ?? 'eu-central-1',
		color: 'text-green-600',
		darkColor: 'dark:text-green-400',
		displayName: 'ASR Production',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_API_KEY ?? '',
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_PROD_URL ?? '',
		name: 'asr-prod',
	},
	'asr-staging': {
		awsAccount: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_ACCOUNT ?? '323069970350',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_PROFILE ?? 'fixxer-administrator-323069970350',
		awsRegion: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_REGION ?? 'eu-central-1',
		color: 'text-blue-600',
		darkColor: 'dark:text-blue-400',
		displayName: 'ASR Staging',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_API_KEY ?? '',
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_ASR_STAGING_URL ?? '',
		name: 'asr-staging',
	},
	'jaimy-prod': {
		awsAccount: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_ACCOUNT ?? '905418010637',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_PROFILE ?? 'fixxer-administrator-905418010637',
		awsRegion: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_REGION ?? 'eu-central-1',
		color: 'text-red-600',
		darkColor: 'dark:text-red-400',
		displayName: 'Jaimy Production',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_API_KEY ?? '',
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_PROD_URL ?? '',
		name: 'jaimy-prod',
	},
	'jaimy-staging': {
		awsAccount: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_ACCOUNT ?? '058264364375',
		awsProfile: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_PROFILE ?? 'fixxer-administrator-058264364375',
		awsRegion: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_REGION ?? 'eu-central-1',
		color: 'text-orange-600',
		darkColor: 'dark:text-orange-400',
		displayName: 'Jaimy Staging',
		flowLauncherApiKey: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_API_KEY ?? '',
		flowLauncherUrl: process.env.NEXT_PUBLIC_FLOW_LAUNCHER_JAIMY_STAGING_URL ?? '',
		name: 'jaimy-staging',
	},
};
