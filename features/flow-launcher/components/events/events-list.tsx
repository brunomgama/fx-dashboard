'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { eventsApi } from '../../api';
import { useFlowLauncherConfig } from '../../hooks/use-flow-launcher-config';
import type { Event } from '../../types';
import { CreateEventModal } from './create-event-modal';
import { EventCard } from './event-card';
import { EventDetailsPanel } from './event-details-panel';
import { TriggerEventModal } from './trigger-event-modal';

export function EventsList() {
	const { apiConfig } = useFlowLauncherConfig();
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Event | null>(null);
	const [triggering, setTriggering] = useState<Event | null>(null);
	const [showCreate, setShowCreate] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const res = await eventsApi.list(apiConfig, { limit: 100 });
			setEvents(res.results ?? res.items ?? res.Items ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load events');
		} finally {
			setLoading(false);
		}
	}, [apiConfig]);

	useEffect(() => {
		load();
	}, [load]);

	const handleDelete = async (event: Event) => {
		if (!confirm(`Delete event "${event.name}"?`)) return;
		try {
			await eventsApi.delete(apiConfig, event.id);
			if (selected?.id === event.id) setSelected(null);
			await load();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete event');
		}
	};

	const filtered = events.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()));

	if (loading)
		return (
			<div className='flex h-64 items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
			</div>
		);
	if (error)
		return (
			<div className='flex h-64 flex-col items-center justify-center gap-4'>
				<p className='text-destructive'>{error}</p>
				<Button onClick={load}>Retry</Button>
			</div>
		);

	return (
		<div className='flex h-full gap-4 overflow-hidden'>
			{/* List — 2/3 */}
			<div className='flex w-2/3 min-h-0 flex-col'>
				<div className='mb-4 flex items-center gap-3'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input placeholder='Search events...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
					</div>
					<Button onClick={() => setShowCreate(true)}>
						<Plus className='mr-2 h-4 w-4' /> Create Event
					</Button>
					<span className='shrink-0 text-sm text-muted-foreground'>{events.length} events</span>
				</div>

				<div className='flex-1 overflow-y-auto'>
					<div className='grid gap-4 pb-4 md:grid-cols-2'>
						{filtered.map((event) => (
							<EventCard key={event.id} event={event} isSelected={selected?.id === event.id} onSelect={setSelected} onTrigger={setTriggering} onDelete={handleDelete} />
						))}
					</div>
					{filtered.length === 0 && <div className='py-12 text-center text-muted-foreground'>No events found</div>}
				</div>
			</div>

			{/* Details — 1/3 */}
			<div className='w-1/3 shrink-0 overflow-y-auto border-l'>{selected ? <EventDetailsPanel event={selected} onClose={() => setSelected(null)} onUpdate={load} /> : <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>Select an event to view details</div>}</div>

			{triggering && <TriggerEventModal event={triggering} open onClose={() => setTriggering(null)} />}
			{showCreate && <CreateEventModal open onClose={() => setShowCreate(false)} onSuccess={load} />}
		</div>
	);
}
