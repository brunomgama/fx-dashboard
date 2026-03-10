export type TaskTag = 'Bug' | 'Feature' | 'Improvement' | 'Research' | 'Design' | 'DevOps' | 'Urgent' | 'Work' | 'Personal';

export const ALL_TAGS: TaskTag[] = ['Bug', 'Feature', 'Improvement', 'Research', 'Design', 'DevOps', 'Urgent', 'Work', 'Personal'];

export const TAG_STYLES: Record<TaskTag, string> = {
	Bug: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
	Feature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
	Improvement: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
	Research: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
	Design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
	DevOps: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
	Urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
	Work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
	Personal: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	section?: 'today' | 'week';
	createdAt: string;
}

export interface Task {
	id: string;
	title: string;
	completed: boolean;
	tags: TaskTag[];
	dueDate?: string;
	description?: string;
	createdAt: string;
}

export interface Note {
	id: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface RowProps {
	task: Task;
	todayStr: string;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	onEdit: (task: Task) => void;
}

export interface Props {
	open: boolean;
	onClose: () => void;
	onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
	initialDate?: string;
	task?: Task;
}

export interface FormProps {
	initialDate?: string;
	task?: Task;
	onClose: () => void;
	onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}
