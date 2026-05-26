'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Play, Trash2, Zap } from 'lucide-react';
import type { Event } from '../../types';

interface Props {
	event: Event;
	isSelected?: boolean;
	onSelect: (e: Event) => void;
	onTrigger: (e: Event) => void;
	onDelete: (e: Event) => void;
}

export function EventCard({ event, isSelected, onSelect, onTrigger, onDelete }: Props) {
	return (
		<div
			onClick={() => onSelect(event)}
			className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-colors hover:border-primary ${
				isSelected ? 'border-primary bg-primary/5' : ''
			}`}
		>
			{/* Header */}
			<div className='mb-2'>
				<h3 className='text-base font-semibold'>{event.name}</h3>
				<p className='line-clamp-2 text-sm text-muted-foreground'>
					{event.description ?? 'No description'}
				</p>
			</div>

			{/* Flow count */}
			<div className='mb-2 flex items-center gap-1 text-xs text-muted-foreground'>
				<Zap className='h-3 w-3' />
				<span>{event.flow_ids?.length ?? 0} flows</span>
			</div>

			{/* Variables */}
			{event.variables && event.variables.length > 0 && (
				<div className='mb-2 flex flex-wrap gap-1'>
					{event.variables.slice(0, 3).map((v) => (
						<span key={v} className='rounded-md bg-secondary px-2 py-1 text-xs'>
							{v}
						</span>
					))}
					{event.variables.length > 3 && (
						<span className='text-xs text-muted-foreground'>+{event.variables.length - 3}</span>
					)}
				</div>
			)}

			{/* Date */}
			{event.created_at && (
				<div className='mb-3 flex items-center gap-1 border-b pb-3 text-xs text-muted-foreground'>
					<Calendar className='h-3 w-3' />
					<span>{new Date(event.created_at).toLocaleDateString()}</span>
				</div>
			)}

			{/* Actions */}
			<div className='mt-auto flex gap-2'>
				<Button
					size='sm'
					variant='outline'
					className='flex-1'
					onClick={(e) => {
						e.stopPropagation();
						onTrigger(event);
					}}
				>
					<Play className='mr-2 h-4 w-4' /> Trigger
				</Button>
				<Button
					size='sm'
					variant='ghost'
					className='text-destructive hover:bg-destructive/10 hover:text-destructive'
					onClick={(e) => {
						e.stopPropagation();
						onDelete(event);
					}}
				>
					<Trash2 className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
