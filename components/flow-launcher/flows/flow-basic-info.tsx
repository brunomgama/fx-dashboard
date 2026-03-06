'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FlowBasicInfoProps {
	name: string;
	description: string;
	onNameChange: (name: string) => void;
	onDescriptionChange: (description: string) => void;
}

export function FlowBasicInfo({ name, description, onNameChange, onDescriptionChange }: FlowBasicInfoProps) {
	return (
		<div className='space-y-3'>
			<div className='space-y-1.5'>
				<Label htmlFor='flow-name' className='text-sm font-medium'>
					Name
				</Label>
				<Input id='flow-name' value={name} onChange={(e) => onNameChange(e.target.value)} />
			</div>

			<div className='space-y-1.5'>
				<Label htmlFor='flow-desc' className='text-sm font-medium'>
					Description
				</Label>
				<Textarea id='flow-desc' value={description} onChange={(e) => onDescriptionChange(e.target.value)} className='min-h-[5rem] resize-none' placeholder='Add a description...' />
			</div>
		</div>
	);
}
