'use client';

import { EventsList } from '@/components/flow-launcher/events/events-list';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function EventsPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='font-montserrat text-xl font-black'>Events</h1>
			</header>
			<div className='flex-1 overflow-auto p-6'>
				<EventsList />
			</div>
		</div>
	);
}
