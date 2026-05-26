'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

type ClaudeMdData = {
	global: string | null;
	project: string | null;
};

type Scope = 'global' | 'project';

function Editor({ content, scope }: { content: string | null; scope: Scope }) {
	const [value, setValue] = useState(content ?? '');
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [dirty, setDirty] = useState(false);

	useEffect(() => {
		setValue(content ?? '');
		setDirty(false);
	}, [content]);

	const handleChange = (v: string) => {
		setValue(v);
		setDirty(true);
		setSaved(false);
	};

	const save = async () => {
		setSaving(true);
		try {
			await fetch('/api/claude-code/claude-md', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ scope, content: value }),
			});
			setSaved(true);
			setDirty(false);
		} finally {
			setSaving(false);
		}
	};

	if (content === null) {
		return (
			<div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center'>
				<p className='text-sm font-medium'>No CLAUDE.md found</p>
				<p className='mt-1 text-xs text-muted-foreground'>
					{scope === 'global'
						? 'Create ~/.claude/CLAUDE.md to add global instructions.'
						: 'Create CLAUDE.md at the project root to add project-specific instructions.'}
				</p>
				<Button
					variant='outline'
					size='sm'
					className='mt-4'
					onClick={() => {
						setValue('# CLAUDE.md\n\n');
						setDirty(true);
					}}
				>
					Create file
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-3'>
			{scope === 'global' && (
				<div className='rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'>
					This file applies to all Claude Code projects on your machine.
				</div>
			)}
			<Textarea
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				className='h-[420px] font-mono text-xs'
			/>
			<div className='flex items-center gap-2'>
				<Button onClick={save} disabled={saving || !dirty} size='sm'>
					{saving ? 'Saving…' : 'Save'}
				</Button>
				{saved && <span className='text-xs text-green-600 dark:text-green-400'>Saved</span>}
				{dirty && !saved && <span className='text-xs text-muted-foreground'>Unsaved changes</span>}
			</div>
		</div>
	);
}

export function ClaudeMdEditor() {
	const [data, setData] = useState<ClaudeMdData | null>(null);

	useEffect(() => {
		fetch('/api/claude-code/claude-md')
			.then((r) => r.json())
			.then(setData);
	}, []);

	if (!data) {
		return (
			<div className='space-y-3'>
				<Skeleton className='h-6 w-48' />
				<Skeleton className='h-96 w-full' />
			</div>
		);
	}

	return (
		<Tabs defaultValue='global'>
			<TabsList>
				<TabsTrigger value='global'>Global (~/.claude/CLAUDE.md)</TabsTrigger>
				<TabsTrigger value='project'>Project (./CLAUDE.md)</TabsTrigger>
			</TabsList>
			<TabsContent value='global' className='mt-4'>
				<Editor content={data.global} scope='global' />
			</TabsContent>
			<TabsContent value='project' className='mt-4'>
				<Editor content={data.project} scope='project' />
			</TabsContent>
		</Tabs>
	);
}
