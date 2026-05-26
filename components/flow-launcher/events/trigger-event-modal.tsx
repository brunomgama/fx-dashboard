'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFlowLauncherConfig } from '@/hooks/use-flow-launcher-config';
import type { FlowEvent } from '@/types/flow-launcher';
import { CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface TriggerEventModalProps {
	event: FlowEvent;
	onClose: () => void;
	open: boolean;
}

export function TriggerEventModal({ event, onClose, open }: TriggerEventModalProps) {
	const { awsRegion, environment } = useFlowLauncherConfig();
	const [inputs, setInputs] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [executionArn, setExecutionArn] = useState('');
	const [error, setError] = useState('');

	const handleTrigger = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await fetch(`/api/flow-launcher/trigger?environment=${environment}`, {
				body: JSON.stringify({ id: event.id, input: Object.keys(inputs).length > 0 ? inputs : undefined }),
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
			});
			if (!res.ok) {
				const err = (await res.json()) as { error: string };
				throw new Error(err.error);
			}
			const data = (await res.json()) as { executionArn?: string };
			setExecutionArn(data.executionArn ?? 'Triggered successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to trigger event');
		} finally {
			setLoading(false);
		}
	};

	const consoleUrl = executionArn
		? `https://${awsRegion}.console.aws.amazon.com/states/home?region=${awsRegion}#/executions/details/${executionArn}`
		: '';

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='font-montserrat font-black'>Trigger: {event.name}</DialogTitle>
					<DialogDescription className='font-montserrat font-light'>{event.description}</DialogDescription>
				</DialogHeader>

				{!executionArn ? (
					<div className='space-y-4'>
						{event.variables && event.variables.length > 0 ? (
							<>
								<p className='font-montserrat text-sm font-light text-muted-foreground'>Override variables (optional):</p>
								{event.variables.map((v) => (
									<div key={v} className='space-y-2'>
										<Label htmlFor={v} className='font-montserrat font-semibold'>{v}</Label>
										<Input
											id={v}
											placeholder={`Enter ${v}...`}
											value={inputs[v] ?? ''}
											onChange={(e) => setInputs({ ...inputs, [v]: e.target.value })}
											className='font-montserrat font-light'
										/>
									</div>
								))}
							</>
						) : (
							<p className='font-montserrat text-sm font-light text-muted-foreground'>No variables. Defaults will be used.</p>
						)}
						{error && <p className='rounded-lg border border-destructive bg-destructive/10 p-3 font-montserrat text-sm font-light text-destructive'>{error}</p>}
						<div className='flex justify-end gap-2 pt-2'>
							<Button variant='outline' onClick={onClose} disabled={loading} className='font-montserrat font-semibold'>
								Cancel
							</Button>
							<Button onClick={() => void handleTrigger()} disabled={loading} className='font-montserrat font-semibold'>
								{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Trigger Event
							</Button>
						</div>
					</div>
				) : (
					<div className='space-y-4'>
						<div className='flex items-center gap-2 text-green-600'>
							<CheckCircle className='h-5 w-5' />
							<span className='font-montserrat font-semibold'>Event triggered successfully!</span>
						</div>
						<div className='space-y-1'>
							<Label className='font-montserrat font-semibold'>Execution ARN</Label>
							<p className='break-all rounded-lg bg-secondary p-3 font-mono text-xs'>{executionArn}</p>
						</div>
						<div className='flex justify-end gap-2'>
							<Button variant='outline' onClick={onClose} className='font-montserrat font-semibold'>
								Close
							</Button>
							<Button onClick={() => window.open(consoleUrl, '_blank')} className='font-montserrat font-semibold'>
								<ExternalLink className='mr-2 h-4 w-4' /> View in AWS Console
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
