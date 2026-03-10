'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../storage';
import type { RowProps, Task } from '../../types';
import { TAG_STYLES } from '../../types';
import { CreateTaskModal } from './create-task-modal';

function generateId() {
	return Math.random().toString(36).slice(2, 10);
}

export function TasksList() {
	const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage<Task[]>(STORAGE_KEYS.tasks, []));
	const [search, setSearch] = useState('');
	const [creating, setCreating] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.tasks, tasks);
	}, [tasks]);

	const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
		setTasks((prev) => [{ ...data, id: generateId(), completed: false, createdAt: new Date().toISOString() }, ...prev]);
	};

	const updateTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
		if (!editingTask) return;
		setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t)));
		setEditingTask(null);
	};

	const toggleTask = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
	const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

	const todayStr = new Date().toISOString().split('T')[0];

	const filtered = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

	const pending = filtered.filter((t) => !t.completed);
	const completed = filtered.filter((t) => t.completed);

	return (
		<div className='flex h-full flex-col rounded-lg border bg-card'>
			{/* Header */}
			<div className='flex items-center justify-between border-b px-4 py-3'>
				<h2 className='font-semibold'>Tasks</h2>
				<div className='flex items-center gap-2'>
					<span className='text-xs text-muted-foreground'>
						{tasks.filter((t) => t.completed).length}/{tasks.length} done
					</span>
					<Button size='sm' onClick={() => setCreating(true)}>
						+ New Task
					</Button>
				</div>
			</div>

			{/* Search */}
			<div className='border-b px-4 py-2'>
				<div className='relative'>
					<Search className='absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
					<Input placeholder='Search tasks...' value={search} onChange={(e) => setSearch(e.target.value)} className='h-8 pl-8 text-sm' />
				</div>
			</div>

			{/* List */}
			<div className='flex-1 space-y-1 overflow-y-auto p-4'>
				{pending.length === 0 && completed.length === 0 && <p className='py-8 text-center text-sm text-muted-foreground'>No tasks yet</p>}

				{pending.map((task) => (
					<TaskRow key={task.id} task={task} todayStr={todayStr} onToggle={toggleTask} onDelete={deleteTask} onEdit={setEditingTask} />
				))}

				{completed.length > 0 && (
					<>
						<p className='pb-1 pt-4 text-xs font-medium text-muted-foreground'>Completed</p>
						{completed.map((task) => (
							<TaskRow key={task.id} task={task} todayStr={todayStr} onToggle={toggleTask} onDelete={deleteTask} onEdit={setEditingTask} />
						))}
					</>
				)}
			</div>

			{/* Modals */}
			<CreateTaskModal open={creating} onClose={() => setCreating(false)} onSave={addTask} />
			{editingTask && <CreateTaskModal open task={editingTask} onClose={() => setEditingTask(null)} onSave={updateTask} />}
		</div>
	);
}

function TaskRow({ task, todayStr, onToggle, onDelete, onEdit }: RowProps) {
	const isOverdue = task.dueDate && task.dueDate.split('T')[0] < todayStr && !task.completed;
	const isToday = task.dueDate && task.dueDate.split('T')[0] === todayStr;

	return (
		<div className='group flex items-start gap-2.5 rounded-md border bg-background px-3 py-2.5 transition-colors hover:bg-muted/30'>
			<input type='checkbox' checked={task.completed} onChange={() => onToggle(task.id)} className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary' />
			<div className='min-w-0 flex-1'>
				<p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
				<div className='mt-1 flex flex-wrap items-center gap-1'>
					{task.dueDate && (
						<span className={`text-xs ${isOverdue ? 'text-red-400' : isToday ? 'text-green-400' : 'text-muted-foreground'}`}>
							{isOverdue ? '⚠ ' : ''}
							{task.dueDate.split('T')[0]}
						</span>
					)}
					{task.tags.map((tag) => (
						<span key={tag} className={`rounded-full px-2 py-0.5 text-xs font-medium ${TAG_STYLES[tag]}`}>
							{tag}
						</span>
					))}
					{task.description && <span className='text-xs text-muted-foreground italic'>· has description</span>}
				</div>
			</div>
			<div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
				<Button size='icon-lg' variant='ghost' className='text-muted-foreground hover:text-foreground' onClick={() => onEdit(task)}>
					<Pencil className='h-5 w-5' />
				</Button>
				<Button size='icon-lg' variant='ghost' className='text-muted-foreground hover:text-destructive' onClick={() => onDelete(task.id)}>
					<Trash2 className='h-5 w-5' />
				</Button>
			</div>
		</div>
	);
}
