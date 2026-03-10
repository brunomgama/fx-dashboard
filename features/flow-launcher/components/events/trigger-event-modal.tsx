'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { eventsApi } from '../../api';
import { useFlowLauncherConfig } from '../../hooks/use-flow-launcher-config';
import type { Event } from '../../types';

interface Props {
	event: Event;
	open: boolean;
	onClose: () => void;
}

export function TriggerEventModal({ event, open, onClose }: Props) {
	const { apiConfig, envConfig } = useFlowLauncherConfig();
	const [inputs, setInputs] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [executionArn, setExecutionArn] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (open) {
			setInputs({});
			setExecutionArn('');
			setError('');
		}
	}, [open]);

	const handleTrigger = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await eventsApi.trigger(apiConfig, {
				id: event.id,
				input: Object.keys(inputs).length > 0 ? inputs : undefined,
			});
			setExecutionArn(res.executionArn ?? 'Triggered successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to trigger event');
		} finally {
			setLoading(false);
		}
	};

	const consoleUrl = executionArn ? `https://${envConfig.region}.console.aws.amazon.com/states/home?region=${envConfig.region}#/executions/details/${executionArn}` : '';

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Trigger: {event.name}</DialogTitle>
					<DialogDescription>{event.description}</DialogDescription>
				</DialogHeader>

				{!executionArn ? (
					<div className='space-y-4'>
						{event.variables && event.variables.length > 0 ? (
							<>
								<p className='text-sm text-muted-foreground'>Override variables (optional):</p>
								{event.variables.map((v) => (
									<div key={v} className='space-y-2'>
										<Label htmlFor={v}>{v}</Label>
										<Input id={v} placeholder={`Enter ${v}...`} value={inputs[v] ?? ''} onChange={(e) => setInputs({ ...inputs, [v]: e.target.value })} />
									</div>
								))}
							</>
						) : (
							<p className='text-sm text-muted-foreground'>No variables. Defaults will be used.</p>
						)}
						{error && <p className='rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive'>{error}</p>}
						<div className='flex justify-end gap-2 pt-2'>
							<Button variant='outline' onClick={onClose} disabled={loading}>
								Cancel
							</Button>
							<Button onClick={handleTrigger} disabled={loading}>
								{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Trigger Event
							</Button>
						</div>
					</div>
				) : (
					<div className='space-y-4'>
						<div className='flex items-center gap-2 text-green-600'>
							<CheckCircle className='h-5 w-5' />
							<span className='font-semibold'>Event triggered successfully!</span>
						</div>
						<div className='space-y-1'>
							<Label>Execution ARN</Label>
							<p className='break-all rounded-lg bg-secondary p-3 font-mono text-xs'>{executionArn}</p>
						</div>
						<div className='flex justify-end gap-2'>
							<Button variant='outline' onClick={onClose}>
								Close
							</Button>
							<Button onClick={() => window.open(consoleUrl, '_blank')}>
								<ExternalLink className='mr-2 h-4 w-4' /> View in AWS Console
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
