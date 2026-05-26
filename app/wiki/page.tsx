'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { WikiBrowser } from '@/features/wiki/components/wiki-browser';

export default function WikiPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Wiki Page</h1>
			</header>
			<div className='min-h-0 flex-1 overflow-hidden p-6'>
				<WikiBrowser />
			</div>
		</div>
	);
}
