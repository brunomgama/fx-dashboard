'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { flowLauncherAPI } from '../../api';
import { CreateEventRequest } from '../../types';

interface CreateEventModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export function CreateEventModal({ open, onClose, onSuccess }: CreateEventModalProps) {
	const { environmentConfig } = useFlowLauncher();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [formData, setFormData] = useState({
		name: '',
	});

	const handleSubmit = useCallback(async () => {
		setLoading(true);
		setError('');

		try {
			const data: CreateEventRequest = {
				user: 'dashboard-user',
				name: formData.name,
			};

			await flowLauncherAPI.triggerEvent(environmentConfig, data);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create event');
		} finally {
			setLoading(false);
		}
	}, [environmentConfig, formData, onClose, onSuccess]);

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Create New Event</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Event Name *</Label>
						<Input id='name' placeholder='my-custom-event' value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
					</div>

					{error && <div className='p-3 border border-destructive rounded-lg bg-destructive/10 text-sm text-destructive'>{error}</div>}

					<div className='flex justify-end gap-2 pt-4'>
						<Button variant='outline' onClick={onClose} disabled={loading}>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={loading || !formData.name}>
							{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Create Event
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
