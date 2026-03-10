'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Play, Trash2, Zap } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
	event: Event;
	onTrigger: (event: Event) => void;
	onDelete: (event: Event) => void;
	onSelect: (event: Event) => void;
	isSelected?: boolean;
}

export function EventCard({ event, onTrigger, onDelete, onSelect, isSelected }: EventCardProps) {
	return (
		<div className={`border rounded-lg p-4 flex flex-col h-full hover:border-primary transition-colors cursor-pointer ${isSelected ? 'border-primary bg-primary/5' : ''}`} onClick={() => onSelect(event)}>
			<div className='flex items-start justify-between mb-3'>
				<div className='flex-1'>
					<h3 className='font-semibold text-lg'>{event.name}</h3>
					<p className='text-sm text-muted-foreground line-clamp-2'>{event.description || 'No description'}</p>
				</div>
			</div>

			<div className='flex items-center gap-2 text-xs text-muted-foreground mb-3'>
				<Zap className='h-3 w-3' />
				<span>{event.flow_ids?.length || 0} flows</span>
			</div>

			{event.variables && event.variables.length > 0 && (
				<div className='flex flex-wrap gap-1 mb-3'>
					{event.variables.slice(0, 3).map((variable) => (
						<span key={variable} className='px-2 py-1 text-xs bg-secondary rounded-md'>
							{variable}
						</span>
					))}
					{event.variables.length > 3 && <span className='px-2 py-1 text-xs text-muted-foreground'>+{event.variables.length - 3} more</span>}
				</div>
			)}

			{event.created_at && (
				<div className='flex items-center gap-1 text-xs text-muted-foreground mb-3 pb-3 border-b'>
					<Calendar className='h-3 w-3' />
					<span>{new Date(event.created_at).toLocaleDateString()}</span>
				</div>
			)}

			{/* Spacer to push button to bottom */}
			<div className='flex-1' />

			{/* Button always at bottom */}
			<div className='flex items-center gap-2 mt-auto'>
				<Button
					size='sm'
					onClick={(e) => {
						e.stopPropagation();
						onTrigger(event);
					}}
					className='flex-1'>
					<Play className='mr-2 h-4 w-4' />
					Trigger
				</Button>
				<Button
					size='sm'
					variant='destructive'
					onClick={(e) => {
						e.stopPropagation();
						onDelete(event);
					}}>
					<Trash2 className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
