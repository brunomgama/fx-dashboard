'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ClaudeCodeDashboard } from '@/features/claude-code/components/claude-code-dashboard';

export default function ClaudeCodePage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Claude Code</h1>
			</header>
			<div className='flex-1 overflow-auto p-6'>
				<ClaudeCodeDashboard />
			</div>
		</div>
	);
}
