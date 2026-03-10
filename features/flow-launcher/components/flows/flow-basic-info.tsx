'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
	name: string;
	description: string;
	onNameChange: (v: string) => void;
	onDescriptionChange: (v: string) => void;
}

export function FlowBasicInfo({ name, description, onNameChange, onDescriptionChange }: Props) {
	return (
		<div className='space-y-3'>
			<div className='space-y-1.5'>
				<Label htmlFor='flow-name'>Name</Label>
				<Input id='flow-name' value={name} onChange={(e) => onNameChange(e.target.value)} />
			</div>
			<div className='space-y-1.5'>
				<Label htmlFor='flow-desc'>Description</Label>
				<Textarea id='flow-desc' value={description} onChange={(e) => onDescriptionChange(e.target.value)} className='min-h-[5rem] resize-none' placeholder='Add a description...' />
			</div>
		</div>
	);
}
