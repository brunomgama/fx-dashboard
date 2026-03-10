'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { flowLauncherAPI } from '../../api';
import { Event } from '../../types';

interface TriggerEventModalProps {
	event: Event;
	open: boolean;
	onClose: () => void;
}

export function TriggerEventModal({ event, open, onClose }: TriggerEventModalProps) {
	const { environmentConfig, fullConfig } = useFlowLauncher();
	const [inputs, setInputs] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [executionArn, setExecutionArn] = useState<string>('');
	const [error, setError] = useState<string>('');

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
		setExecutionArn('');

		try {
			const response = await flowLauncherAPI.triggerEvent(environmentConfig, {
				id: event.id,
				input: Object.keys(inputs).length > 0 ? inputs : undefined,
			});

			setExecutionArn(response.executionArn || 'Event triggered successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to trigger event');
		} finally {
			setLoading(false);
		}
	};

	const getConsoleUrl = () => {
		if (!executionArn) return '';
		return `https://${fullConfig.region}.console.aws.amazon.com/states/home?region=${fullConfig.region}#/executions/details/${executionArn}`;
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Trigger Event: {event.name}</DialogTitle>
					<DialogDescription>{event.description}</DialogDescription>
				</DialogHeader>

				{!executionArn ? (
					<div className='space-y-4'>
						{event.variables && event.variables.length > 0 ? (
							<>
								<p className='text-sm text-muted-foreground'>Provide values for variables (optional - defaults will be used if available):</p>
								{event.variables.map((variable) => (
									<div key={variable} className='space-y-2'>
										<Label htmlFor={variable}>{variable}</Label>
										<Input id={variable} placeholder={`Enter ${variable}...`} value={inputs[variable] || ''} onChange={(e) => setInputs({ ...inputs, [variable]: e.target.value })} />
									</div>
								))}
							</>
						) : (
							<p className='text-sm text-muted-foreground'>This event has no variables. Click trigger to execute with defaults.</p>
						)}

						{error && <div className='p-3 border border-destructive rounded-lg bg-destructive/10 text-sm text-destructive'>{error}</div>}

						<div className='flex justify-end gap-2 pt-4'>
							<Button variant='outline' onClick={onClose} disabled={loading}>
								Cancel
							</Button>
							<Button onClick={handleTrigger} disabled={loading}>
								{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Trigger Event
							</Button>
						</div>
					</div>
				) : (
					<div className='space-y-4'>
						<div className='flex items-center gap-2 text-green-600'>
							<CheckCircle className='h-5 w-5' />
							<span className='font-semibold'>Event triggered successfully!</span>
						</div>

						<div className='space-y-2'>
							<Label>Execution ARN</Label>
							<div className='p-3 bg-secondary rounded-lg font-mono text-xs break-all'>{executionArn}</div>
						</div>

						<div className='flex justify-end gap-2'>
							<Button variant='outline' onClick={onClose}>
								Close
							</Button>
							<Button onClick={() => window.open(getConsoleUrl(), '_blank')}>
								<ExternalLink className='mr-2 h-4 w-4' />
								View in AWS Console
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
