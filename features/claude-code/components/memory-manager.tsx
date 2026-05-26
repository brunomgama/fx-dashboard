'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

type MemoryEntry = {
	filename: string;
	name: string;
	description: string;
	type: string;
	body: string;
};

const TYPE_STYLES: Record<string, string> = {
	user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
	feedback: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
	project: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
	reference: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
	unknown: 'bg-muted text-muted-foreground',
};

function TypeBadge({ type }: { type: string }) {
	const cls = TYPE_STYLES[type] ?? TYPE_STYLES.unknown;
	return (
		<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{type}</span>
	);
}

function MemoryCard({
	entry,
	onView,
	onDelete,
}: {
	entry: MemoryEntry;
	onView: (e: MemoryEntry) => void;
	onDelete: (filename: string) => void;
}) {
	const [confirming, setConfirming] = useState(false);

	return (
		<div className='flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/40'>
			<div className='flex items-start justify-between gap-2'>
				<div className='min-w-0 flex-1'>
					<div className='mb-1 flex items-center gap-2'>
						<TypeBadge type={entry.type} />
						<span className='truncate text-sm font-medium'>{entry.name}</span>
					</div>
					{entry.description && (
						<p className='line-clamp-2 text-xs text-muted-foreground'>{entry.description}</p>
					)}
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<Button variant='outline' size='sm' onClick={() => onView(entry)}>
					View
				</Button>
				{confirming ? (
					<>
						<Button
							variant='destructive'
							size='sm'
							onClick={() => {
								onDelete(entry.filename);
								setConfirming(false);
							}}
						>
							Confirm delete
						</Button>
						<Button variant='ghost' size='sm' onClick={() => setConfirming(false)}>
							Cancel
						</Button>
					</>
				) : (
					<Button variant='ghost' size='sm' onClick={() => setConfirming(true)}>
						Delete
					</Button>
				)}
			</div>
		</div>
	);
}

export function MemoryManager() {
	const [entries, setEntries] = useState<MemoryEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState<MemoryEntry | null>(null);
	const [memoryIndex, setMemoryIndex] = useState<string | null>(null);

	const load = () => {
		fetch('/api/claude-code/memory')
			.then((r) => r.json())
			.then((data) => {
				setEntries(data.files ?? []);
				setMemoryIndex(data.memoryIndex ?? null);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleDelete = async (filename: string) => {
		await fetch('/api/claude-code/memory', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ filename }),
		});
		load();
	};

	if (loading) {
		return (
			<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
				{[...Array(4)].map((_, i) => (
					<Skeleton key={i} className='h-24 rounded-lg' />
				))}
			</div>
		);
	}

	if (entries.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center'>
				<p className='text-sm font-medium'>No memory files yet</p>
				<p className='mt-1 text-xs text-muted-foreground'>
					Claude Code will create memories here as it learns about you and this project.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className='mb-4 flex items-center justify-between'>
				<p className='text-sm text-muted-foreground'>
					{entries.length} {entries.length === 1 ? 'file' : 'files'}
				</p>
				{memoryIndex && (
					<button
						className='text-xs text-muted-foreground underline-offset-2 hover:underline'
						onClick={() =>
							setSelected({ filename: 'MEMORY.md', name: 'MEMORY.md (index)', description: '', type: 'index', body: memoryIndex })
						}
					>
						View index
					</button>
				)}
			</div>

			<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
				{entries.map((entry) => (
					<MemoryCard
						key={entry.filename}
						entry={entry}
						onView={setSelected}
						onDelete={handleDelete}
					/>
				))}
			</div>

			<Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
				<DialogContent className='max-w-2xl'>
					{selected && (
						<div className='space-y-3'>
							<div className='flex items-center gap-2'>
								<TypeBadge type={selected.type} />
								<span className='font-medium'>{selected.name}</span>
							</div>
							{selected.description && (
								<p className='text-sm text-muted-foreground'>{selected.description}</p>
							)}
							<pre className='max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed whitespace-pre-wrap'>
								{selected.body}
							</pre>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
