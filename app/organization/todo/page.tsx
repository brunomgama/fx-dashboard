'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { TodoList } from '@/features/organization/components/todo/todo-list';

export default function TodoPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<div>
					<h1 className='text-xl font-semibold'>Todo</h1>
					<p className='text-xs text-muted-foreground'>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
				</div>
			</header>
			<div className='flex-1 overflow-hidden p-6'>
				<TodoList />
			</div>
		</div>
	);
}
