'use client';

import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Task, Todo } from '../../types';
import { TAG_STYLES } from '../../types';

interface Props {
	date: string;
	tasks: Task[];
	todos: Todo[];
	onToggleTask: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onToggleTodo: (id: string) => void;
	onAddTask: (date: string) => void;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	});
}

export function DayPanel({ date, tasks, todos, onToggleTask, onDeleteTask, onToggleTodo, onAddTask }: Props) {
	const dayTasks = tasks.filter((t) => t.dueDate?.split('T')[0] === date);
	const pendingTodos = todos.filter((t) => !t.completed);

	return (
		<div className='flex h-full flex-col rounded-lg border bg-card'>
			{/* Header */}
			<div className='border-b px-4 py-4'>
				<h2 className='text-base font-semibold'>{formatDate(date)}</h2>
				<p className='mt-0.5 text-sm text-muted-foreground'>
					{dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''} scheduled
				</p>
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-4'>
				{/* Tasks section */}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<h3 className='text-sm font-semibold'>Tasks</h3>
						<Button size='sm' variant='ghost' className='h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground' onClick={() => onAddTask(date)}>
							<Plus className='h-3 w-3' /> Add
						</Button>
					</div>

					{dayTasks.length === 0 ? (
						<p className='rounded-md border border-dashed py-3 text-center text-xs text-muted-foreground'>No tasks scheduled for this day</p>
					) : (
						<div className='space-y-2'>
							{dayTasks.map((task) => (
								<div key={task.id} className='group flex items-start gap-2.5 rounded-md border bg-background px-3 py-2.5'>
									<input type='checkbox' checked={task.completed} onChange={() => onToggleTask(task.id)} className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary' />
									<div className='min-w-0 flex-1'>
										<p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
										{task.tags.length > 0 && (
											<div className='mt-1 flex flex-wrap gap-1'>
												{task.tags.map((tag) => (
													<span key={tag} className={`rounded-full px-2 py-0.5 text-xs font-medium ${TAG_STYLES[tag]}`}>
														{tag}
													</span>
												))}
											</div>
										)}
									</div>
									<Button size='sm' variant='ghost' className='h-6 w-6 shrink-0 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive' onClick={() => onDeleteTask(task.id)}>
										<Trash2 className='h-3 w-3' />
									</Button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Divider */}
				<div className='border-t' />

				{/* Todos section */}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<h3 className='text-sm font-semibold'>Todo</h3>
						<span className='text-xs text-muted-foreground'>No deadline</span>
					</div>
					<p className='text-xs text-muted-foreground'>Always visible — no due date.</p>

					{pendingTodos.length === 0 ? (
						<p className='rounded-md border border-dashed py-3 text-center text-xs text-muted-foreground'>No pending todos</p>
					) : (
						<div className='space-y-1.5'>
							{pendingTodos.map((todo) => (
								<div key={todo.id} className='flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-muted/40'>
									<input type='checkbox' checked={todo.completed} onChange={() => onToggleTodo(todo.id)} className='h-4 w-4 shrink-0 cursor-pointer accent-primary' />
									<p className={`flex-1 text-sm font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>{todo.title}</p>
									<span
										className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium
                      ${todo.section === 'today' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-muted text-muted-foreground'}`}>
										{todo.section === 'today' ? 'Today' : 'This week'}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
