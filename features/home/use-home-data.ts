'use client';

import { loadFromStorage, STORAGE_KEYS } from '@/features/organization/storage';
import type { Task, Todo } from '@/features/organization/types';
import { useEffect, useState } from 'react';

export function useHomeData() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		setTodos(loadFromStorage<Todo[]>(STORAGE_KEYS.todos, []));
		setTasks(loadFromStorage<Task[]>(STORAGE_KEYS.tasks, []));
	}, []);

	const todayStr = new Date().toISOString().split('T')[0];
	const pendingTodos = todos.filter((t) => !t.completed).length;
	const pendingTasks = tasks.filter((t) => !t.completed).length;
	const todayTasks = tasks.filter((t) => t.dueDate?.split('T')[0] === todayStr && !t.completed).length;
	const overdueTasks = tasks.filter((t) => t.dueDate && t.dueDate.split('T')[0] < todayStr && !t.completed).length;

	return { todos, tasks, pendingTodos, pendingTasks, todayTasks, overdueTasks };
}
