'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { FlowsList } from '@/features/flow-launcher/components/flows/flows-list';

export default function FlowsPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Flows</h1>
			</header>
			<div className='min-h-0 flex-1 overflow-hidden p-6'>
				<FlowsList />
			</div>
		</div>
	);
}
