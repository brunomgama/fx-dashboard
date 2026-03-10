/**
 * Centralized Environment Management Types
 * 
 * This file contains all environment-related type definitions.
 * Features should import these types instead of defining their own.
 */

// ─── Core Environment Types ───────────────────────────────────────────────────

export type Environment = 'jaimy-staging' | 'jaimy-prod' | 'asr-staging' | 'asr-prod';

// ─── Base Environment Configuration ───────────────────────────────────────────

export interface BaseEnvironmentConfig {
	name: Environment;
	displayName: string;
	account: string;
	region: string;
	awsProfile: string;
	color: string;
	darkColor: string;
}

// ─── Feature-Specific Configurations ──────────────────────────────────────────

export interface FlowLauncherConfig {
	url: string;
	apiKey: string;
}

export interface EmailServiceConfig {
	url: string;
	apiKey: string;
}

export interface AwsSsoConfig {
	// AWS SSO specific configuration can be added here
	enabled: boolean;
}

// ─── Complete Environment Configuration ───────────────────────────────────────

export interface EnvironmentConfig extends BaseEnvironmentConfig {
	flowLauncher: FlowLauncherConfig;
	emailService: EmailServiceConfig;
	awsSso: AwsSsoConfig;
}

// ─── Environment Context Type ─────────────────────────────────────────────────

export interface EnvironmentContextType {
	environment: Environment;
	config: EnvironmentConfig;
	setEnvironment: (env: Environment) => void;
}
