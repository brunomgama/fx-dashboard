'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { CalendarView } from '@/features/organization/components/calendar/calendar-view';

export default function CalendarPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<div>
					<h1 className='text-xl font-semibold'>Calendar</h1>
					<p className='text-xs text-muted-foreground'>Click a day to see its tasks and todos</p>
				</div>
			</header>
			<div className='flex-1 overflow-hidden p-6'>
				<CalendarView />
			</div>
		</div>
	);
}
