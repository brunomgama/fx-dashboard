'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../storage';
import type { Task, Todo } from '../../types';
import { CreateTaskModal } from '../tasks/create-task-modal';
import { CalendarGrid } from './calendar-grid';
import { DayPanel } from './day-panel';

function toDateStr(date: Date): string {
	return date.toISOString().split('T')[0];
}

function generateId() {
	return Math.random().toString(36).slice(2, 10);
}

export function CalendarView() {
	const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage<Task[]>(STORAGE_KEYS.tasks, []));
	const [todos, setTodos] = useState<Todo[]>(() => loadFromStorage<Todo[]>(STORAGE_KEYS.todos, []));
	const [selectedDate, setSelectedDate] = useState<string>(toDateStr(new Date()));
	const [addingForDate, setAddingForDate] = useState<string | null>(null);

	// Keep localStorage in sync
	useEffect(() => {
		saveToStorage(STORAGE_KEYS.tasks, tasks);
	}, [tasks]);
	useEffect(() => {
		saveToStorage(STORAGE_KEYS.todos, todos);
	}, [todos]);

	const toggleTask = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

	const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

	const toggleTodo = (id: string) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

	const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
		setTasks((prev) => [{ ...data, id: generateId(), completed: false, createdAt: new Date().toISOString() }, ...prev]);
	};

	return (
		<div className='flex h-full gap-4'>
			{/* Calendar — 2/3 */}
			<div className='flex-[2] min-w-0'>
				<CalendarGrid tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
			</div>

			{/* Day panel — 1/3 */}
			<div className='w-80 shrink-0'>
				<DayPanel date={selectedDate} tasks={tasks} todos={todos} onToggleTask={toggleTask} onDeleteTask={deleteTask} onToggleTodo={toggleTodo} onAddTask={(date) => setAddingForDate(date)} />
			</div>

			{/* Pre-fill due date when adding from calendar */}
			{addingForDate && <CreateTaskModal open initialDate={addingForDate} onClose={() => setAddingForDate(null)} onSave={addTask} />}
		</div>
	);
}
