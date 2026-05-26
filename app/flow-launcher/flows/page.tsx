'use client';

import { FlowsList } from '@/components/flow-launcher/flows/flows-list';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function FlowsPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='font-montserrat text-xl font-black'>Flows</h1>
			</header>
			<div className='flex-1 overflow-auto p-6'>
				<FlowsList />
			</div>
		</div>
	);
}
