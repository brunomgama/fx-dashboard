import { KNOWN_COMPANIES, KNOWN_ENVS, ParsedName } from '../types';

/**
 * Parse a state machine name into its components
 * Pattern: {project}-{...name...}-{env}-{company}
 * env:     dev | staging | prod
 * company: jaimy | mri | asr
 * project: launcher | email | smart-events (etc.)
 */
export function parseName(name: string): ParsedName {
	const parts = name.split('-');

	// Find company (last known company segment from the right)
	let companyIdx = -1;
	for (let i = parts.length - 1; i >= 0; i--) {
		if ((KNOWN_COMPANIES as readonly string[]).includes(parts[i])) {
			companyIdx = i;
			break;
		}
	}

	// Find env (just before company)
	let envIdx = -1;
	for (let i = (companyIdx === -1 ? parts.length : companyIdx) - 1; i >= 0; i--) {
		if ((KNOWN_ENVS as readonly string[]).includes(parts[i])) {
			envIdx = i;
			break;
		}
	}

	const company = companyIdx !== -1 ? parts[companyIdx] : 'unknown';
	const env = envIdx !== -1 ? parts[envIdx] : 'unknown';

	// Project is the first segment(s) before the middle name
	// Middle name is everything between project and env
	const middleStart = 1;
	const middleEnd = envIdx !== -1 ? envIdx : parts.length;
	const project = parts[0] ?? 'unknown';
	const middle = parts.slice(middleStart, middleEnd).join('-');

	return { project, name: middle || name, env, company, raw: name };
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
	return new Date(date).toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}

/**
 * Format duration between two dates
 */
export function formatDuration(startDate: string, stopDate?: string): string {
	const start = new Date(startDate).getTime();
	const end = stopDate ? new Date(stopDate).getTime() : Date.now();
	const ms = end - start;
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	const mins = Math.floor(ms / 60000);
	const secs = Math.floor((ms % 60000) / 1000);
	return `${mins}m ${secs}s`;
}
