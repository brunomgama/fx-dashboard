export function loadFromStorage<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : fallback;
	} catch {
		return fallback;
	}
}

export function saveToStorage<T>(key: string, value: T): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(key, JSON.stringify(value));
}

export const STORAGE_KEYS = {
	todos: 'org:todos',
	tasks: 'org:tasks',
	notes: 'org:notes',
} as const;
