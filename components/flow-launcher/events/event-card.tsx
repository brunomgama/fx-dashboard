'use client';

import { Button } from '@/components/ui/button';
import type { FlowEvent } from '@/types/flow-launcher';
import { Calendar, Play, Trash2, Zap } from 'lucide-react';

interface EventCardProps {
	event: FlowEvent;
	isSelected?: boolean;
	onDelete: (e: FlowEvent) => void;
	onSelect: (e: FlowEvent) => void;
	onTrigger: (e: FlowEvent) => void;
}

export function EventCard({ event, isSelected, onDelete, onSelect, onTrigger }: EventCardProps) {
	return (
		<div onClick={() => onSelect(event)}
			className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-colors hover:border-primary ${isSelected ? 'border-primary bg-primary/5' : ''}`}>
			<div className='mb-2'>
				<h3 className='font-montserrat text-base font-semibold'>{event.name}</h3>
				<p className='line-clamp-2 font-montserrat text-sm font-light text-muted-foreground'>{event.description ?? 'No description'}</p>
			</div>

			<div className='mb-2 flex items-center gap-1 font-montserrat text-xs font-light text-muted-foreground'>
				<Zap className='h-3 w-3' />
				<span>{event.flow_ids?.length ?? 0} flows</span>
			</div>

			{event.variables && event.variables.length > 0 && (
				<div className='mb-2 flex flex-wrap gap-1'>
					{event.variables.slice(0, 3).map((v) => (
						<span key={v} className='rounded-md bg-secondary px-2 py-1 font-montserrat text-xs font-light'>
							{v}
						</span>
					))}
					{event.variables.length > 3 && <span className='font-montserrat text-xs font-light text-muted-foreground'>+{event.variables.length - 3}</span>}
				</div>
			)}

			{event.created_at && (
				<div className='mb-3 flex items-center gap-1 border-b pb-3 font-montserrat text-xs font-light text-muted-foreground'>
					<Calendar className='h-3 w-3' />
					<span>{new Date(event.created_at).toLocaleDateString()}</span>
				</div>
			)}

			<div className='mt-auto flex gap-2'>
				<Button size='sm' variant='outline' className='flex-1 font-montserrat font-semibold'
					onClick={(e) => {
						e.stopPropagation();
						onTrigger(event);
					}}>
					<Play className='mr-2 h-4 w-4' /> Trigger
				</Button>
				<Button size='sm' variant='ghost' className='text-destructive hover:bg-destructive/10 hover:text-destructive'
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
