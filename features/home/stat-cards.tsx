import type { Task, Todo } from '@/features/organization/types';
import { TAG_STYLES } from '@/features/organization/types';
import { CalendarDays, CheckSquare, ListTodo } from 'lucide-react';

interface Props {
	pendingTodos: number;
	pendingTasks: number;
	todayTasks: number;
	overdueTasks: number;
	todos: Todo[];
	tasks: Task[];
}

function getTaskUrgency(task: Task): number {
	const todayStr = new Date().toISOString().split('T')[0];
	if (!task.dueDate) return 3; // no date — lowest
	if (task.dueDate.split('T')[0] < todayStr) return 0; // overdue — highest
	if (task.dueDate.split('T')[0] === todayStr) return 1; // today
	return 2; // future
}

function TopTasks({ tasks }: { tasks: Task[] }) {
	const todayStr = new Date().toISOString().split('T')[0];
	const top = [...tasks]
		.filter((t) => !t.completed)
		.sort((a, b) => getTaskUrgency(a) - getTaskUrgency(b))
		.slice(0, 3);

	if (top.length === 0) return <p className='text-xs text-muted-foreground italic'>No pending tasks</p>;

	return (
		<div className='mt-3 space-y-1.5'>
			{top.map((task) => {
				const isOverdue = task.dueDate && task.dueDate.split('T')[0] < todayStr;
				const isToday = task.dueDate && task.dueDate.split('T')[0] === todayStr;
				return (
					<div key={task.id} className='flex items-start gap-2'>
						<span
							className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full
              ${isOverdue ? 'bg-red-400' : isToday ? 'bg-green-400' : 'bg-blue-400'}`}
						/>
						<div className='min-w-0 flex-1'>
							<p className='truncate text-xs font-medium'>{task.title}</p>
							<div className='flex items-center gap-1'>
								{isOverdue && <span className='text-[10px] text-red-400'>overdue</span>}
								{isToday && <span className='text-[10px] text-green-400'>today</span>}
								{task.tags.slice(0, 1).map((tag) => (
									<span key={tag} className={`rounded-full px-1.5 py-0 text-[10px] font-medium ${TAG_STYLES[tag]}`}>
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function TopTodos({ todos }: { todos: Todo[] }) {
	const top = [...todos]
		.filter((t) => !t.completed)
		.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
		.slice(0, 3);

	if (top.length === 0) return <p className='text-xs text-muted-foreground italic'>No pending todos</p>;

	return (
		<div className='mt-3 space-y-1.5'>
			{top.map((todo) => (
				<div key={todo.id} className='flex items-center gap-2'>
					<span className='h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400' />
					<p className='truncate text-xs font-medium'>{todo.title}</p>
				</div>
			))}
		</div>
	);
}

export function StatCards({ pendingTodos, pendingTasks, todayTasks, overdueTasks, todos, tasks }: Props) {
	const totalPending = pendingTodos + pendingTasks;

	return (
		<div className='grid grid-cols-3 gap-4'>
			{/* Pending card */}
			<div className='rounded-lg border bg-card p-4'>
				<div className='flex items-center gap-2'>
					<CheckSquare className='h-5 w-5 text-blue-400' />
					<p className='text-xs font-medium text-muted-foreground'>Pending</p>
				</div>
				<p className='mt-2 text-3xl font-bold tabular-nums'>{totalPending}</p>
				<p className='mt-0.5 text-xs text-muted-foreground'>
					{pendingTodos} todos · {pendingTasks} tasks
				</p>

				{pendingTodos > 0 && (
					<div className='mt-3 border-t pt-3'>
						<p className='mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>Top todos</p>
						<TopTodos todos={todos} />
					</div>
				)}

				{pendingTasks > 0 && (
					<div className='mt-3 border-t pt-3'>
						<p className='mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>Top tasks</p>
						<TopTasks tasks={tasks.filter((t) => !t.completed)} />
					</div>
				)}

				{totalPending === 0 && (
					<div className='mt-3 border-t pt-3'>
						<p className='text-xs italic text-muted-foreground'>Nothing pending</p>
					</div>
				)}
			</div>

			{/* Due today */}
			<div className='rounded-lg border bg-card p-4'>
				<div className='flex items-center gap-2'>
					<CalendarDays className='h-5 w-5 text-green-400' />
					<p className='text-xs font-medium text-muted-foreground'>Due Today</p>
				</div>
				<p className='mt-2 text-3xl font-bold tabular-nums'>{todayTasks}</p>
				<p className='mt-0.5 text-xs text-muted-foreground'>tasks for today</p>
				<div className='mt-3 border-t pt-3'>
					<p className='mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>Top tasks</p>
					<TopTasks tasks={tasks.filter((t) => t.dueDate?.split('T')[0] === new Date().toISOString().split('T')[0])} />
				</div>
			</div>

			{/* Overdue */}
			<div className={`rounded-lg border bg-card p-4 ${overdueTasks > 0 ? 'border-red-400/50 bg-red-500/5' : ''}`}>
				<div className='flex items-center gap-2'>
					<ListTodo className='h-5 w-5 text-red-400' />
					<p className='text-xs font-medium text-muted-foreground'>Overdue</p>
				</div>
				<p className={`mt-2 text-3xl font-bold tabular-nums ${overdueTasks > 0 ? 'text-red-400' : ''}`}>{overdueTasks}</p>
				<p className='mt-0.5 text-xs text-muted-foreground'>need attention</p>
				<div className='mt-3 border-t pt-3'>
					<p className='mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>Top tasks</p>
					<TopTasks tasks={tasks.filter((t) => t.dueDate && t.dueDate.split('T')[0] < new Date().toISOString().split('T')[0])} />
				</div>
			</div>
		</div>
	);
}
