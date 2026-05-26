'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { WikiChat } from '@/features/wiki/components/wiki-chat';

export default function WikiChatPage() {
	return (
		<div className="flex h-screen flex-col">
			<header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
				<SidebarTrigger />
				<h1 className="text-xl font-semibold">Wiki Chat</h1>
			</header>
			<div className="min-h-0 flex-1 overflow-hidden p-6">
				<WikiChat />
			</div>
		</div>
	);
}
