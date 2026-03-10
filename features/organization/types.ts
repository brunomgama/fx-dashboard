export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	section?: 'today' | 'week';
	createdAt: string;
}

export type TaskTag = 'Work' | 'Personal' | 'Bug' | 'Feature' | 'Urgent';

export interface Task {
	id: string;
	title: string;
	completed: boolean;
	tags: TaskTag[];
	dueDate?: string;
	createdAt: string;
}

export interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export const TAG_STYLES: Record<TaskTag, string> = {
	Work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
	Personal: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
	Bug: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
	Feature: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
	Urgent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

export const ALL_TAGS: TaskTag[] = ['Work', 'Personal', 'Bug', 'Feature', 'Urgent'];
