'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFlowLauncherConfig } from '@/hooks/use-flow-launcher-config';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CreateEventModalProps {
	onClose: () => void;
	onSuccess: () => void;
	open: boolean;
}

export function CreateEventModal({ onClose, onSuccess, open }: CreateEventModalProps) {
	const { environment } = useFlowLauncherConfig();
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await fetch(`/api/flow-launcher/events?environment=${environment}`, {
				body: JSON.stringify({ name, user: 'dashboard-user' }),
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
			});
			if (!res.ok) {
				const err = (await res.json()) as { error: string };
				throw new Error(err.error);
			}
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
					<DialogTitle className='font-montserrat font-black'>Create New Event</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name' className='font-montserrat font-semibold'>Event Name *</Label>
						<Input id='name' placeholder='my-event' value={name} onChange={(e) => setName(e.target.value)} className='font-montserrat font-light' />
					</div>
					{error && <p className='rounded-lg border border-destructive bg-destructive/10 p-3 font-montserrat text-sm font-light text-destructive'>{error}</p>}
					<div className='flex justify-end gap-2 pt-2'>
						<Button variant='outline' onClick={onClose} disabled={loading} className='font-montserrat font-semibold'>
							Cancel
						</Button>
						<Button onClick={() => void handleSubmit()} disabled={loading || !name} className='font-montserrat font-semibold'>
							{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Create
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
