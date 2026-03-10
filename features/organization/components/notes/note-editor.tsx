'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Note } from '../../types';

interface Props {
	note: Note;
	onUpdate: (id: string, changes: Partial<Note>) => void;
	onDelete: (id: string) => void;
}

function renderMarkdown(md: string): string {
	return md
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-4 mb-1">$1</h3>')
		.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2">$1</h2>')
		.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold mt-6 mb-2">$1</h1>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 font-mono text-sm">$1</code>')
		.replace(/^- (.+)$/gm, '<li class="ml-5 list-disc">$1</li>')
		.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal">$2</li>')
		.replace(/\n\n/g, '<br/><br/>')
		.replace(/\n/g, '<br/>');
}

export function NoteEditor({ note, onUpdate, onDelete }: Props) {
	const [preview, setPreview] = useState(false);

	return (
		<div className='flex h-full flex-col rounded-lg border bg-card'>
			{/* Header */}
			<div className='flex items-center gap-3 border-b px-4 py-3'>
				<Input value={note.title} onChange={(e) => onUpdate(note.id, { title: e.target.value })} className='h-8 border-0 bg-transparent p-0 text-base font-semibold shadow-none focus-visible:ring-0' placeholder='Note title...' />
				<div className='flex shrink-0 items-center gap-1'>
					<Button size='sm' variant='ghost' className={`h-7 w-7 p-0 ${!preview ? 'bg-muted' : ''}`} onClick={() => setPreview(false)} title='Edit'>
						<Pencil className='h-3.5 w-3.5' />
					</Button>
					<Button size='sm' variant='ghost' className={`h-7 w-7 p-0 ${preview ? 'bg-muted' : ''}`} onClick={() => setPreview(true)} title='Preview'>
						<Eye className='h-3.5 w-3.5' />
					</Button>
					<Button size='sm' variant='ghost' className='h-7 w-7 p-0 text-muted-foreground hover:text-destructive' onClick={() => onDelete(note.id)}>
						<Trash2 className='h-3.5 w-3.5' />
					</Button>
				</div>
			</div>

			{/* Body */}
			<div className='flex-1 overflow-hidden'>{preview ? <div className='h-full overflow-y-auto p-5 text-sm leading-relaxed prose-neutral max-w-none' dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) || '<span class="text-muted-foreground">Nothing to preview</span>' }} /> : <textarea value={note.content} onChange={(e) => onUpdate(note.id, { content: e.target.value })} className='h-full w-full resize-none bg-transparent p-5 font-mono text-sm outline-none' placeholder={'# My Note\n\nStart writing in **markdown**...\n\n- Item one\n- Item two'} spellCheck={false} />}</div>

			{/* Footer */}
			<div className='border-t px-4 py-2'>
				<p className='text-xs text-muted-foreground'>Updated {new Date(note.updatedAt).toLocaleString()}</p>
			</div>
		</div>
	);
}
