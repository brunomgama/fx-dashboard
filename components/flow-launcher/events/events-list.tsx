'use client';

import { ErrorComponent } from '@/components/error/error';
import { LoadingComponent } from '@/components/loading/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFlowLauncherConfig } from '@/hooks/use-flow-launcher-config';
import type { FlowEvent, ListResponse } from '@/types/flow-launcher';
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CreateEventModal } from './create-event-modal';
import { EventCard } from './event-card';
import { EventDetailsPanel } from './event-details-panel';
import { TriggerEventModal } from './trigger-event-modal';

export function EventsList() {
	const { environment } = useFlowLauncherConfig();
	const [events, setEvents] = useState<FlowEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<FlowEvent | null>(null);
	const [triggering, setTriggering] = useState<FlowEvent | null>(null);
	const [showCreate, setShowCreate] = useState(false);

	const load = useCallback(() => {
		fetch(`/api/flow-launcher/events?environment=${environment}`)
			.then(async (res) => {
				if (!res.ok) {
					const err = (await res.json()) as { error: string };
					throw new Error(err.error);
				}
				return res.json() as Promise<ListResponse<FlowEvent>>;
			})
			.then((data) => {
				setEvents(data.results ?? data.items ?? data.Items ?? []);
				setError('');
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : 'Failed to load events');
			})
			.finally(() => setLoading(false));
	}, [environment]);

	useEffect(() => {
		load();
	}, [load]);

	const handleDelete = async (event: FlowEvent) => {
		try {
			const res = await fetch(`/api/flow-launcher/events/${event.id}?environment=${environment}`, { method: 'DELETE' });
			if (!res.ok) {
				const err = (await res.json()) as { error: string };
				throw new Error(err.error);
			}
			if (selected?.id === event.id) setSelected(null);
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete event');
		}
	};

	const filtered = events.filter(
		(e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading) return <LoadingComponent />;

	if (error) return <ErrorComponent message={error} onRetry={() => { setLoading(true); load(); }} />;

	return (
		<div className='flex h-full gap-4'>
			<div className='flex w-2/3 flex-col'>
				<div className='mb-4 flex items-center gap-3'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input placeholder='Search events...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10 font-montserrat font-light' />
					</div>
					<Button onClick={() => setShowCreate(true)} className='font-montserrat font-semibold'>
						<Plus className='mr-2 h-4 w-4' /> Create Event
					</Button>
					<span className='shrink-0 font-montserrat text-sm font-light text-muted-foreground'>{events.length} events</span>
				</div>

				<div className='flex-1 overflow-y-auto'>
					<div className='grid gap-4 pb-4 md:grid-cols-2'>
						{filtered.map((event) => (
							<EventCard
								key={event.id}
								event={event}
								isSelected={selected?.id === event.id}
								onSelect={setSelected}
								onTrigger={setTriggering}
								onDelete={(e) => void handleDelete(e)}
							/>
						))}
					</div>
					{filtered.length === 0 && <div className='py-12 text-center font-montserrat font-light text-muted-foreground'>No events found</div>}
				</div>
			</div>

			<div className='w-1/3 border-l'>
				{selected ? (
					<EventDetailsPanel key={selected.id} event={selected} onClose={() => setSelected(null)} onUpdate={() => load()} />
				) : (
					<div className='flex h-full items-center justify-center font-montserrat text-sm font-light text-muted-foreground'>
						Select an event to view details
					</div>
				)}
			</div>

			{triggering && <TriggerEventModal key={triggering.id} event={triggering} open onClose={() => setTriggering(null)} />}
			{showCreate && <CreateEventModal open onClose={() => setShowCreate(false)} onSuccess={() => { setLoading(true); load(); }} />}
		</div>
	);
}
