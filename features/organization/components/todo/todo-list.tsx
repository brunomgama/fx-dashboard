'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../storage';
import type { Todo } from '../../types';

function generateId() {
	return Math.random().toString(36).slice(2, 10);
}

export function TodoList() {
	const [todos, setTodos] = useState<Todo[]>(() => loadFromStorage<Todo[]>(STORAGE_KEYS.todos, []));
	const [newTodo, setNewTodo] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.todos, todos);
	}, [todos]);

	const addTodo = () => {
		if (!newTodo.trim()) return;
		setTodos((prev) => [...prev, { id: generateId(), title: newTodo.trim(), completed: false, section: 'today', createdAt: new Date().toISOString() }]);
		setNewTodo('');
		inputRef.current?.focus();
	};

	const toggleTodo = (id: string) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
	const deleteTodo = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));

	const pending = todos.filter((t) => !t.completed);
	const completed = todos.filter((t) => t.completed);
	const done = completed.length;
	const total = todos.length;

	return (
		<div className='flex h-full flex-col rounded-lg border bg-card'>
			<div className='flex items-center justify-between border-b px-4 py-3'>
				<h2 className='font-semibold'>Todo</h2>
				{total > 0 && (
					<span className='text-xs text-muted-foreground'>
						{done}/{total} done
					</span>
				)}
			</div>

			<div className='flex-1 space-y-1 overflow-y-auto p-4'>
				{pending.map((todo) => (
					<TodoRow key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
				))}

				{completed.length > 0 && (
					<>
						<p className='pb-1 pt-3 text-xs font-medium text-muted-foreground'>Completed</p>
						{completed.map((todo) => (
							<TodoRow key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
						))}
					</>
				)}

				{todos.length === 0 && <p className='py-8 text-center text-sm text-muted-foreground'>Nothing here yet</p>}
			</div>

			<div className='flex gap-2 border-t p-3'>
				<Input ref={inputRef} placeholder='Add todo...' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} className='h-8 text-sm' />
				<Button size='sm' onClick={addTodo} disabled={!newTodo.trim()}>
					<Plus className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}

function TodoRow({ todo, onToggle, onDelete }: { todo: Todo; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
	return (
		<div className='group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50'>
			<input type='checkbox' checked={todo.completed} onChange={() => onToggle(todo.id)} className='h-4 w-4 cursor-pointer rounded accent-primary' />
			<span className={`flex-1 text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>{todo.title}</span>
			<Button size='sm' variant='ghost' className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive' onClick={() => onDelete(todo.id)}>
				<Trash2 className='h-3 w-3' />
			</Button>
		</div>
	);
}
