'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { EventConfigsList } from '@/features/flow-launcher/components/event-configs/event-configs-list';

export default function EventConfigsPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Event Configs</h1>
			</header>
			<div className='min-h-0 flex-1 overflow-y-auto p-6'>
				<EventConfigsList />
			</div>
		</div>
	);
}
