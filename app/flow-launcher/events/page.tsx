'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { EventsList } from '@/features/flow-launcher/components/events/events-list';

export default function EventsPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Events</h1>
			</header>
			<div className='min-h-0 flex-1 overflow-hidden p-6'>
				<EventsList />
			</div>
		</div>
	);
}
