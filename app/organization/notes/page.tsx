'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotesList } from '@/features/organization/components/notes/notes-list';

export default function NotesPage() {
	return (
		<div className='flex h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Notes</h1>
			</header>
			<div className='flex-1 overflow-hidden p-6'>
				<NotesList />
			</div>
		</div>
	);
}
