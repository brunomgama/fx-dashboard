'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import type { Task, TaskTag } from '../../types';
import { ALL_TAGS, TAG_STYLES } from '../../types';

interface Props {
	open: boolean;
	onClose: () => void;
	onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
	initialDate?: string;
}

export function CreateTaskModal({ open, onClose, onSave, initialDate }: Props) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-md'>
				<DialogHeader>
					<DialogTitle>New Task</DialogTitle>
				</DialogHeader>
				<CreateTaskForm key={`${initialDate}-${open}`} initialDate={initialDate} onClose={onClose} onSave={onSave} />
			</DialogContent>
		</Dialog>
	);
}

interface FormProps {
	initialDate?: string;
	onClose: () => void;
	onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

function CreateTaskForm({ initialDate, onClose, onSave }: FormProps) {
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState<TaskTag[]>([]);
	const [dueDate, setDueDate] = useState(initialDate ?? '');

	const toggleTag = (tag: TaskTag) => {
		setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
	};

	const handleSave = () => {
		if (!title.trim()) return;
		onSave({ title: title.trim(), tags, dueDate: dueDate || undefined });
		onClose();
	};

	return (
		<div className='space-y-4'>
			<div className='space-y-1.5'>
				<Label>Title *</Label>
				<Input placeholder='Task title...' value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSave()} autoFocus />
			</div>

			<div className='space-y-1.5'>
				<Label>Tags</Label>
				<div className='flex flex-wrap gap-2'>
					{ALL_TAGS.map((tag) => (
						<button key={tag} onClick={() => toggleTag(tag)} className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity ${TAG_STYLES[tag]} ${tags.includes(tag) ? 'opacity-100 ring-2 ring-offset-1 ring-current' : 'opacity-60 hover:opacity-100'}`}>
							{tag}
						</button>
					))}
				</div>
			</div>

			<div className='space-y-1.5'>
				<Label>Due Date</Label>
				<Input type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
			</div>

			<div className='flex justify-end gap-2 pt-2'>
				<Button variant='outline' onClick={onClose}>
					Cancel
				</Button>
				<Button onClick={handleSave} disabled={!title.trim()}>
					Create Task
				</Button>
			</div>
		</div>
	);
}
