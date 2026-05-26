'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FlowBasicInfoProps {
	description: string;
	name: string;
	onDescriptionChange: (v: string) => void;
	onNameChange: (v: string) => void;
}

export function FlowBasicInfo({ description, name, onDescriptionChange, onNameChange }: FlowBasicInfoProps) {
	return (
		<div className='space-y-3'>
			<div className='space-y-1.5'>
				<Label htmlFor='flow-name' className='font-montserrat font-semibold'>Name</Label>
				<Input id='flow-name' value={name} onChange={(e) => onNameChange(e.target.value)} />
			</div>
			<div className='space-y-1.5'>
				<Label htmlFor='flow-desc' className='font-montserrat font-semibold'>Description</Label>
				<Textarea id='flow-desc' value={description} onChange={(e) => onDescriptionChange(e.target.value)} className='min-h-[5rem] resize-none font-montserrat font-light' placeholder='Add a description...' />
			</div>
		</div>
	);
}
