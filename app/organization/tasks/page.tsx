'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { TasksList } from '@/features/organization/components/tasks/tasks-list';

export default function TasksPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Tasks</h1>
			</header>
			<div className='flex-1 overflow-hidden p-6'>
				<TasksList />
			</div>
		</div>
	);
}
