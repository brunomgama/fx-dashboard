// ─── State Machine Types ──────────────────────────────────────────────────────

export interface StateMachine {
	name: string;
	stateMachineArn: string;
	type: string;
	creationDate: string;
}

export interface ParsedName {
	project: string;
	name: string;
	env: string;
	company: string;
	raw: string;
}

// ─── Execution Types ──────────────────────────────────────────────────────────

export interface Execution {
	name: string;
	executionArn: string;
	status: ExecutionStatus;
	startDate: string;
	stopDate?: string;
}

export type ExecutionStatus = 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED_OUT' | 'ABORTED';

export interface ExecutionCounts {
	RUNNING: number;
	SUCCEEDED: number;
	FAILED: number;
	TIMED_OUT: number;
	ABORTED: number;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export const KNOWN_ENVS = ['dev', 'staging', 'prod'] as const;
export const KNOWN_COMPANIES = ['jaimy', 'mri', 'asr'] as const;
export const KNOWN_PROJECTS = ['launcher', 'email', 'smart-events'] as const;

export type Env = (typeof KNOWN_ENVS)[number];
export type Company = (typeof KNOWN_COMPANIES)[number];
export type Project = (typeof KNOWN_PROJECTS)[number];

// ─── Style Constants ──────────────────────────────────────────────────────────

export const ENV_COLORS: Record<string, string> = {
	prod: 'bg-red-100 text-red-700 border-red-300',
	staging: 'bg-yellow-100 text-yellow-700 border-yellow-300',
	dev: 'bg-green-100 text-green-700 border-green-300',
	unknown: 'bg-gray-100 text-gray-600 border-gray-300',
};

export const PROJECT_COLORS: Record<string, string> = {
	launcher: 'bg-blue-100 text-blue-700 border-blue-300',
	email: 'bg-purple-100 text-purple-700 border-purple-300',
	'smart-events': 'bg-cyan-100 text-cyan-700 border-cyan-300',
	unknown: 'bg-gray-100 text-gray-600 border-gray-300',
};

export const STATUS_STYLES: Record<ExecutionStatus, { dot: string; badge: string; label: string }> = {
	SUCCEEDED: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700 border-green-300', label: 'Succeeded' },
	FAILED: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-700 border-red-300', label: 'Failed' },
	RUNNING: { dot: 'bg-blue-500 animate-pulse', badge: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Running' },
	TIMED_OUT: { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700 border-orange-300', label: 'Timed Out' },
	ABORTED: { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 border-gray-300', label: 'Aborted' },
};
