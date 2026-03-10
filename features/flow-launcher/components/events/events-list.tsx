'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { flowLauncherAPI } from '../../api';
import { Event } from '../../types';
import { CreateEventModal } from './create-event-modal';
import { EventCard } from './event-card';
import { EventDetailsPanel } from './event-details-panel';
import { TriggerEventModal } from './trigger-event-modal';

export function EventsList() {
	const { environmentConfig, fullConfig } = useFlowLauncher();
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [showTriggerModal, setShowTriggerModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [selectedEventForDetails, setSelectedEventForDetails] = useState<Event | null>(null);

	const loadEvents = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const response = await flowLauncherAPI.listEvents(environmentConfig, { limit: 100 });
			const eventData = response.results || response.Items || response.items || [];
			console.log('Loaded events:', eventData.length, 'events from', fullConfig.displayName);
			setEvents(eventData);
		} catch (err) {
			console.error('Error loading events:', err);
			setError(err instanceof Error ? err.message : 'Failed to load events');
		} finally {
			setLoading(false);
		}
	}, [environmentConfig, fullConfig.displayName]);

	useEffect(() => {
		loadEvents();
	}, [loadEvents]);

	const handleTriggerEvent = (event: Event) => {
		setSelectedEvent(event);
		setShowTriggerModal(true);
	};

	const handleDeleteEvent = async (event: Event) => {
		if (!confirm(`Are you sure you want to delete event "${event.name}"?`)) return;

		try {
			await flowLauncherAPI.deleteEvent(environmentConfig, event.id);
			await loadEvents();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete event');
		}
	};

	const handleSelectEvent = (event: Event) => {
		setSelectedEventForDetails(event);
	};

	const filteredEvents = events.filter((event) => event.name.toLowerCase().includes(searchQuery.toLowerCase()) || event.description?.toLowerCase().includes(searchQuery.toLowerCase()));

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center h-64 gap-4'>
				<p className='text-destructive'>{error}</p>
				<Button onClick={loadEvents}>Retry</Button>
			</div>
		);
	}

	return (
		<div className='flex gap-4 h-full overflow-hidden'>
			{/* Left side - Events list */}
			<div className={`flex flex-col w-2/3 min-h-0`}>
				{/* Sticky search bar */}
				<div className='flex items-center gap-4 pb-4 flex-shrink-0'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input placeholder='Search events...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
					</div>
					<Button onClick={() => setShowCreateModal(true)}>
						<Plus className='mr-2 h-4 w-4' />
						Create Event
					</Button>
					<h3 className='font-semibold text-lg'>{events.length} Events</h3>
				</div>

				{/* Scrollable grid */}
				<div className='overflow-y-auto flex-1 min-h-0'>
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 pb-4'>
						{filteredEvents.map((event) => (
							<EventCard key={event.id} event={event} onTrigger={handleTriggerEvent} onDelete={handleDeleteEvent} onSelect={handleSelectEvent} isSelected={selectedEventForDetails?.id === event.id} />
						))}
					</div>

					{filteredEvents.length === 0 && <div className='text-center py-12 text-muted-foreground'>No events found</div>}
				</div>
			</div>

			{/* Right side - Event details panel (always visible) */}
			<div className='w-1/3 flex-shrink-0 overflow-y-auto border-l'>
				{selectedEventForDetails ? (
					<EventDetailsPanel event={selectedEventForDetails} onClose={() => setSelectedEventForDetails(null)} onUpdate={loadEvents} />
				) : (
					<div className='flex flex-col items-center justify-center h-full text-muted-foreground gap-2'>
						<p className='text-sm'>Select an event to view details</p>
					</div>
				)}
			</div>

			{/* ...existing modals... */}
			{showTriggerModal && selectedEvent && (
				<TriggerEventModal
					event={selectedEvent}
					open={showTriggerModal}
					onClose={() => {
						setShowTriggerModal(false);
						setSelectedEvent(null);
					}}
				/>
			)}

			{showCreateModal && <CreateEventModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={loadEvents} />}
		</div>
	);
}
