'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../storage';
import type { Task, TaskTag } from '../../types';
import { ALL_TAGS, TAG_STYLES } from '../../types';
import { CreateTaskModal } from './create-task-modal';

function generateId() {
	return Math.random().toString(36).slice(2, 10);
}

function isOverdue(dueDate?: string) {
	if (!dueDate) return false;
	return new Date(dueDate) < new Date(new Date().toDateString());
}

export function TasksList() {
	const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage<Task[]>(STORAGE_KEYS.tasks, []));
	const [search, setSearch] = useState('');
	const [activeTag, setActiveTag] = useState<TaskTag | null>(null);
	const [showCreate, setShowCreate] = useState(false);
	const [showDone, setShowDone] = useState(false);

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.tasks, tasks);
	}, [tasks]);

	const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
		setTasks((prev) => [{ ...data, id: generateId(), completed: false, createdAt: new Date().toISOString() }, ...prev]);
	};

	const toggleTask = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
	const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

	const filtered = tasks.filter((t) => {
		const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
		const matchTag = !activeTag || t.tags.includes(activeTag);
		const matchDone = showDone || !t.completed;
		return matchSearch && matchTag && matchDone;
	});

	const pending = filtered.filter((t) => !t.completed);
	const completed = filtered.filter((t) => t.completed);
	const doneCount = tasks.filter((t) => t.completed).length;

	return (
		<div className='flex h-full flex-col space-y-4'>
			{/* Toolbar */}
			<div className='flex items-center gap-3'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input placeholder='Search tasks...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
				</div>
				<Button onClick={() => setShowCreate(true)}>
					<Plus className='mr-2 h-4 w-4' /> New Task
				</Button>
			</div>

			{/* Tag filters */}
			<div className='flex flex-wrap gap-2'>
				<button onClick={() => setActiveTag(null)} className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${!activeTag ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>
					All
				</button>
				{ALL_TAGS.map((tag) => (
					<button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity ${TAG_STYLES[tag]} ${activeTag === tag ? 'opacity-100 ring-2 ring-offset-1 ring-current' : 'opacity-60 hover:opacity-100'}`}>
						{tag}
					</button>
				))}
			</div>

			{/* Tasks */}
			<div className='flex-1 overflow-y-auto space-y-2'>
				{pending.map((task) => (
					<TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
				))}

				{pending.length === 0 && !showDone && (
					<div className='py-16 text-center text-muted-foreground'>
						<p className='font-medium'>All clear!</p>
						<p className='text-sm mt-1'>No pending tasks{activeTag ? ` tagged "${activeTag}"` : ''}</p>
					</div>
				)}

				{doneCount > 0 && (
					<button onClick={() => setShowDone((v) => !v)} className='text-xs text-muted-foreground hover:text-foreground pt-2'>
						{showDone ? '▾' : '▸'} {doneCount} completed task{doneCount !== 1 ? 's' : ''}
					</button>
				)}

				{showDone && completed.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)}
			</div>

			<CreateTaskModal open={showCreate} onClose={() => setShowCreate(false)} onSave={addTask} />
		</div>
	);
}

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
	const overdue = isOverdue(task.dueDate) && !task.completed;

	return (
		<div className='group flex items-start gap-3 rounded-lg border bg-card px-4 py-3 hover:bg-muted/30 transition-colors'>
			<input type='checkbox' checked={task.completed} onChange={() => onToggle(task.id)} className='mt-0.5 h-4 w-4 rounded accent-primary cursor-pointer shrink-0' />
			<div className='flex-1 min-w-0'>
				<p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
				<div className='mt-1.5 flex flex-wrap items-center gap-2'>
					{task.tags.map((tag) => (
						<span key={tag} className={`rounded-full px-2 py-0.5 text-xs font-medium ${TAG_STYLES[tag]}`}>
							{tag}
						</span>
					))}
					{task.dueDate && (
						<span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
							{overdue ? '⚠ ' : ''}Due {new Date(task.dueDate).toLocaleDateString()}
						</span>
					)}
				</div>
			</div>
			<Button size='sm' variant='ghost' className='h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0' onClick={() => onDelete(task.id)}>
				<Trash2 className='h-4 w-4' />
			</Button>
		</div>
	);
}
