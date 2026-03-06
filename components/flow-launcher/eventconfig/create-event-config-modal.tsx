'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { flowLauncherAPI } from '@/lib/flow-launcher-api';
import { CreateEventConfigRequest, EventConfig, UpdateEventConfigRequest } from '@/types/flow-launcher';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface CreateEventConfigModalProps {
	open: boolean;
	config: EventConfig | null;
	onClose: () => void;
	onSuccess: () => void;
}

export function CreateEventConfigModal({ open, config, onClose, onSuccess }: CreateEventConfigModalProps) {
	const { environmentConfig } = useFlowLauncher();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [formData, setFormData] = useState({
		id: '',
		defaults: '',
	});

	useEffect(() => {
		if (config) {
			setFormData({
				id: config.id,
				defaults: JSON.stringify(JSON.parse(config.defaults || '{}'), null, 2),
			});
		} else {
			setFormData({
				id: '',
				defaults: '{}',
			});
		}
	}, [config]);

	const handleSubmit = useCallback(async () => {
		setLoading(true);
		setError('');

		try {
			// Validate JSON
			JSON.parse(formData.defaults);

			if (config) {
				const data: UpdateEventConfigRequest = {
					user: 'dashboard-user',
					defaults: formData.defaults,
				};
				await flowLauncherAPI.updateEventConfig(environmentConfig, formData.id, data);
			} else {
				const data: CreateEventConfigRequest = {
					user: 'dashboard-user',
					id: formData.id,
					defaults: formData.defaults,
				};
				await flowLauncherAPI.createEventConfig(environmentConfig, data);
			}

			onSuccess();
			onClose();
		} catch (err) {
			if (err instanceof SyntaxError) {
				setError('Invalid JSON in defaults field');
			} else {
				setError(err instanceof Error ? err.message : 'Failed to save config');
			}
		} finally {
			setLoading(false);
		}
	}, [config, environmentConfig, formData, onClose, onSuccess]);

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{config ? 'Edit' : 'Create'} Event Config</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='id'>Event ID *</Label>
						<Input id='id' placeholder='event-uuid-here' value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} disabled={!!config} />
						<p className='text-xs text-muted-foreground'>Must match an existing event ID</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='defaults'>Default Values (JSON) *</Label>
						<Textarea id='defaults' placeholder='{"variable1": "default-value", "variable2": ["list", "of", "values"]}' value={formData.defaults} onChange={(e) => setFormData({ ...formData, defaults: e.target.value })} className='font-mono text-sm min-h-[200px]' />
					</div>

					{error && <div className='p-3 border border-destructive rounded-lg bg-destructive/10 text-sm text-destructive'>{error}</div>}

					<div className='flex justify-end gap-2 pt-4'>
						<Button variant='outline' onClick={onClose} disabled={loading}>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={loading || !formData.id || !formData.defaults}>
							{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							{config ? 'Update' : 'Create'} Config
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
