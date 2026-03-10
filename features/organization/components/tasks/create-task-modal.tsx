'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import type { FormProps, Props, TaskTag } from '../../types';
import { ALL_TAGS, TAG_STYLES } from '../../types';

export function CreateTaskModal({ open, onClose, onSave, initialDate, task }: Props) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
				</DialogHeader>
				<CreateTaskForm key={task?.id ?? `${initialDate}-${open}`} initialDate={initialDate} task={task} onClose={onClose} onSave={onSave} />
			</DialogContent>
		</Dialog>
	);
}

function renderMarkdown(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-2">$1</h3>')
		.replace(/^## (.+)$/gm, '<h2 class="text-base font-semibold mt-3">$1</h2>')
		.replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-3">$1</h1>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/`(.+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs font-mono">$1</code>')
		.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
		.replace(/\n/g, '<br />');
}

function CreateTaskForm({ initialDate, task, onClose, onSave }: FormProps) {
	const [title, setTitle] = useState(task?.title ?? '');
	const [tags, setTags] = useState<TaskTag[]>(task?.tags ?? []);
	const [dueDate, setDueDate] = useState(task?.dueDate ?? initialDate ?? '');
	const [description, setDescription] = useState(task?.description ?? '');
	const [preview, setPreview] = useState(false);

	const toggleTag = (tag: TaskTag) => setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

	const handleSave = () => {
		if (!title.trim()) return;
		onSave({
			title: title.trim(),
			tags,
			dueDate: dueDate || undefined,
			description: description || undefined,
		});
		onClose();
	};

	return (
		<div className='space-y-4'>
			{/* Title */}
			<div className='space-y-1.5'>
				<Label>Title *</Label>
				<Input placeholder='Task title...' value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus />
			</div>

			{/* Tags */}
			<div className='space-y-1.5'>
				<Label>Tags</Label>
				<div className='flex flex-wrap gap-2'>
					{ALL_TAGS.map((tag) => (
						<Button
							key={tag}
							variant='ghost'
							size='sm'
							onClick={() => toggleTag(tag)}
							className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity ${TAG_STYLES[tag]}
      ${tags.includes(tag) ? 'opacity-100 ring-2 ring-current ring-offset-1' : 'opacity-60 hover:opacity-100'}`}>
							{tag}
						</Button>
					))}
				</div>
			</div>

			{/* Due date */}
			<div className='space-y-1.5'>
				<Label>Due Date</Label>
				<Input type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
			</div>

			{/* Description */}
			<div className='space-y-1.5'>
				<div className='flex items-center justify-between'>
					<Label>Description</Label>
					<Button variant='ghost' size='sm' onClick={() => setPreview((p) => !p)} className='h-auto p-0 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent'>
						{preview ? '← Edit' : 'Preview →'}
					</Button>
				</div>
				{preview ? <div className='min-h-[120px] rounded-md border bg-muted/30 px-3 py-2 text-sm' dangerouslySetInnerHTML={{ __html: renderMarkdown(description) || '<span class="text-muted-foreground italic">Nothing to preview</span>' }} /> : <Textarea placeholder='Add a description... (markdown supported)' value={description} onChange={(e) => setDescription(e.target.value)} className='min-h-[120px] resize-y font-mono text-sm' />}
			</div>

			{/* Actions */}
			<div className='flex justify-end gap-2 pt-2'>
				<Button variant='outline' onClick={onClose}>
					Cancel
				</Button>
				<Button onClick={handleSave} disabled={!title.trim()}>
					{task ? 'Save Changes' : 'Create Task'}
				</Button>
			</div>
		</div>
	);
}
