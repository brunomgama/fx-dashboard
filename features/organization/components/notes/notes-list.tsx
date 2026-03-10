'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from '../../storage';
import type { Note } from '../../types';
import { NoteEditor } from './note-editor';

function generateId() {
	return Math.random().toString(36).slice(2, 10);
}

export function NotesList() {
	const [notes, setNotes] = useState<Note[]>(() => loadFromStorage<Note[]>(STORAGE_KEYS.notes, []));
	const [selected, setSelected] = useState<string | null>(() => {
		const saved = loadFromStorage<Note[]>(STORAGE_KEYS.notes, []);
		return saved[0]?.id ?? null;
	});
	const [search, setSearch] = useState('');

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.notes, notes);
	}, [notes]);

	const createNote = () => {
		const note: Note = {
			id: generateId(),
			title: 'Untitled Note',
			content: '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		setNotes((prev) => [note, ...prev]);
		setSelected(note.id);
	};

	const updateNote = (id: string, changes: Partial<Note>) => {
		setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n)));
	};

	const deleteNote = (id: string) => {
		setNotes((prev) => {
			const next = prev.filter((n) => n.id !== id);
			setSelected(next[0]?.id ?? null);
			return next;
		});
	};

	const filtered = notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

	const activeNote = notes.find((n) => n.id === selected) ?? null;

	return (
		<div className='flex h-full gap-4'>
			{/* List — 1/3 */}
			<div className='flex w-72 shrink-0 flex-col gap-3'>
				<div className='flex gap-2'>
					<div className='relative flex-1'>
						<Search className='absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
						<Input placeholder='Search notes...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-8 h-8 text-sm' />
					</div>
					<Button size='sm' onClick={createNote} className='h-8 w-8 p-0 shrink-0'>
						<FilePlus className='h-4 w-4' />
					</Button>
				</div>

				<div className='flex-1 overflow-y-auto space-y-1'>
					{filtered.map((note) => (
						<button key={note.id} onClick={() => setSelected(note.id)} className={`w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted ${selected === note.id ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : ''}`}>
							<p className='truncate text-sm font-medium'>{note.title || 'Untitled'}</p>
							<p className='truncate text-xs text-muted-foreground mt-0.5'>{note.content.slice(0, 60) || 'Empty note'}</p>
							<p className='text-xs text-muted-foreground mt-1'>{new Date(note.updatedAt).toLocaleDateString()}</p>
						</button>
					))}

					{filtered.length === 0 && (
						<div className='py-12 text-center'>
							<p className='text-sm text-muted-foreground'>No notes yet</p>
							<Button variant='ghost' size='sm' className='mt-2' onClick={createNote}>
								Create your first note
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Editor — rest */}
			<div className='flex-1 min-w-0'>
				{activeNote ? (
					<NoteEditor note={activeNote} onUpdate={updateNote} onDelete={deleteNote} />
				) : (
					<div className='flex h-full flex-col items-center justify-center rounded-lg border bg-card gap-3'>
						<p className='font-semibold text-muted-foreground'>No note selected</p>
						<Button variant='outline' size='sm' onClick={createNote}>
							<FilePlus className='mr-2 h-4 w-4' /> New Note
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
