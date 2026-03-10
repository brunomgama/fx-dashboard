'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { eventsApi } from '../../api';
import { useFlowLauncherConfig } from '../../hooks/use-flow-launcher-config';

interface Props {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function CreateEventModal({ open, onClose, onSuccess }: Props) {
	const { apiConfig } = useFlowLauncherConfig();
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		setLoading(true);
		setError('');
		try {
			await eventsApi.create(apiConfig, { user: 'dashboard-user', name });
			setName('');
			onSuccess();
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create event');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Event Name *</Label>
						<Input id='name' placeholder='my-event' value={name} onChange={(e) => setName(e.target.value)} />
					</div>
					{error && <p className='rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive'>{error}</p>}
					<div className='flex justify-end gap-2 pt-2'>
						<Button variant='outline' onClick={onClose} disabled={loading}>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={loading || !name}>
							{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Create
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
