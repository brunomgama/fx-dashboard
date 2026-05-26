'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlowLauncherConfig } from '@/hooks/use-flow-launcher-config';
import type { EventConfig, Flow, FlowEvent, ListResponse } from '@/types/flow-launcher';
import { Check, Copy, Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EventDetailsPanelProps {
	event: FlowEvent;
	onClose: () => void;
	onUpdate: () => void;
}

export function EventDetailsPanel({ event, onClose, onUpdate }: EventDetailsPanelProps) {
	const { environment } = useFlowLauncherConfig();
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState('');
	const [isLoadingFlows, setIsLoadingFlows] = useState(true);
	const [flows, setFlows] = useState<Flow[]>([]);
	const [description, setDescription] = useState(event.description ?? '');
	const [selectedFlowIds, setSelectedFlowIds] = useState<string[]>(event.flow_ids ?? []);
	const [defaultVariables, setDefaultVariables] = useState(event.input ?? '{}');
	const [jsonError, setJsonError] = useState('');
	const [copied, setCopied] = useState(false);

	const handleCopyId = () => {
		void navigator.clipboard.writeText(event.id);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleJsonChange = (value: string) => {
		setDefaultVariables(value);
		if (!value.trim()) {
			setJsonError('');
			return;
		}
		try {
			JSON.parse(value);
			setJsonError('');
		} catch (e) {
			setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
		}
	};

	useEffect(() => {
		let cancelled = false;

		Promise.allSettled([
			fetch(`/api/flow-launcher/flows?environment=${environment}`).then((r) => r.json() as Promise<ListResponse<Flow>>),
			fetch(`/api/flow-launcher/event-configs/${event.id}?environment=${environment}`).then((r) => (r.ok ? (r.json() as Promise<EventConfig>) : Promise.reject())),
		]).then(([flowsRes, configRes]) => {
			if (cancelled) return;

			const loadedFlows = flowsRes.status === 'fulfilled' ? (flowsRes.value.results ?? flowsRes.value.items ?? flowsRes.value.Items ?? []) : [];
			setFlows(loadedFlows);

			const existingDefaults = configRes.status === 'fulfilled' ? (JSON.parse(configRes.value.defaults ?? '{}') as Record<string, string>) : {};

			const selected = loadedFlows.filter((f: Flow) => event.flow_ids?.includes(f.id));
			const vars = new Set(selected.flatMap((f: Flow) => f.variables ?? []));
			const json: Record<string, string> = {};
			vars.forEach((v) => {
				json[v] = existingDefaults[v] || `{{${v}}}`;
			});
			setDefaultVariables(JSON.stringify(json, null, 2));
		}).finally(() => {
			if (!cancelled) setIsLoadingFlows(false);
		});

		return () => {
			cancelled = true;
		};
	}, [event.id, event.flow_ids, environment]);

	const toggleFlow = (flowId: string) => {
		const next = selectedFlowIds.includes(flowId) ? selectedFlowIds.filter((id) => id !== flowId) : [...selectedFlowIds, flowId];
		setSelectedFlowIds(next);

		const selected = flows.filter((f) => next.includes(f.id));
		const vars = new Set(selected.flatMap((f) => f.variables ?? []));

		try {
			const current = JSON.parse(defaultVariables ?? '{}') as Record<string, string>;
			vars.forEach((v) => {
				if (!(v in current)) current[v] = `{{${v}}}`;
			});
			Object.keys(current).forEach((k) => {
				if (!vars.has(k) && current[k] === '') delete current[k];
			});
			setDefaultVariables(JSON.stringify(current, null, 2));
			setJsonError('');
		} catch {
			/* JSON currently invalid — skip merge */
		}
	};

	const handleSave = async () => {
		setIsSaving(true);
		setSaveError('');
		try {
			let varsToSave = defaultVariables;
			try {
				const parsed = JSON.parse(defaultVariables) as Record<string, string>;
				Object.keys(parsed).forEach((k) => {
					if (!parsed[k]) parsed[k] = `{{${k}}}`;
				});
				varsToSave = JSON.stringify(parsed, null, 2);
				setDefaultVariables(varsToSave);
			} catch {
				/* invalid JSON — let the API reject it */
			}

			const eventRes = await fetch(`/api/flow-launcher/events/${event.id}?environment=${environment}`, {
				body: JSON.stringify({ description, flow_ids: selectedFlowIds, input: varsToSave, user: 'dashboard-user' }),
				headers: { 'Content-Type': 'application/json' },
				method: 'PUT',
			});
			if (!eventRes.ok) {
				const err = (await eventRes.json()) as { error: string };
				throw new Error(err.error);
			}

			const configRes = await fetch(`/api/flow-launcher/event-configs/${event.id}?environment=${environment}`, {
				body: JSON.stringify({ defaults: varsToSave, user: 'dashboard-user' }),
				headers: { 'Content-Type': 'application/json' },
				method: 'PUT',
			});

			if (!configRes.ok) {
				await fetch(`/api/flow-launcher/event-configs?environment=${environment}`, {
					body: JSON.stringify({ defaults: varsToSave, id: event.id, user: 'dashboard-user' }),
					headers: { 'Content-Type': 'application/json' },
					method: 'POST',
				});
			}

			onUpdate();
		} catch (err) {
			setSaveError(err instanceof Error ? err.message : 'Failed to save');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='flex h-full flex-col bg-background'>
			<div className='flex items-center justify-between border-b p-4'>
				<h2 className='font-montserrat text-lg font-black'>Event Details</h2>
				<Button variant='ghost' size='sm' onClick={onClose}>
					<X className='h-4 w-4' />
				</Button>
			</div>

			<div className='flex-1 overflow-y-auto p-4'>
				<div className='space-y-5'>
					<div className='space-y-1.5'>
						<div className='flex items-center justify-between'>
							<Label className='font-montserrat text-xs font-semibold text-muted-foreground'>ID</Label>
							<Button variant='ghost' size='sm' className='h-5 w-5 p-0 text-muted-foreground/50' onClick={handleCopyId}>
								{copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
							</Button>
						</div>
						<Input value={event.id} disabled className='font-mono text-sm' />
					</div>

					<div className='space-y-1.5'>
						<Label className='font-montserrat font-semibold'>Description</Label>
						<Textarea value={description} onChange={(e) => setDescription(e.target.value)} className='min-h-20 font-montserrat font-light' placeholder='Add a description...' />
					</div>

					<div className='space-y-1.5'>
						<Label className='font-montserrat font-semibold'>Flows ({selectedFlowIds.length} selected)</Label>
						{isLoadingFlows ? (
							<div className='flex items-center justify-center p-8'>
								<Loader2 className='h-6 w-6 animate-spin' />
							</div>
						) : (
							<div className='max-h-48 space-y-2 overflow-y-auto rounded-md border p-3'>
								{flows.map((flow) => (
									<div key={flow.id} className='flex items-center gap-3'>
										<Checkbox id={`flow-${flow.id}`} checked={selectedFlowIds.includes(flow.id)} onCheckedChange={() => toggleFlow(flow.id)} />
										<div className='flex-1'>
											<label htmlFor={`flow-${flow.id}`} className='cursor-pointer font-montserrat text-sm font-semibold'>
												{flow.name}
											</label>
											{flow.description && <p className='font-montserrat text-xs font-light text-muted-foreground'>{flow.description}</p>}
										</div>
									</div>
								))}
								{flows.length === 0 && <p className='text-center font-montserrat text-sm font-light text-muted-foreground'>No flows available</p>}
							</div>
						)}
					</div>

					<div className='space-y-1.5'>
						<div className='flex items-center justify-between'>
							<Label className='font-montserrat font-semibold'>Default Variables</Label>
							{jsonError ? (
								<span className='font-montserrat text-xs font-light text-destructive'>Invalid JSON</span>
							) : (
								<span className='font-montserrat text-xs font-light text-muted-foreground'>JSON</span>
							)}
						</div>
						<div className={`rounded-md border bg-muted/50 ${jsonError ? 'border-destructive' : ''}`}>
							<Textarea
								value={defaultVariables}
								onChange={(e) => handleJsonChange(e.target.value)}
								className='min-h-30 resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0'
								spellCheck={false}
							/>
						</div>
						{jsonError && <p className='font-mono text-xs text-destructive'>{jsonError}</p>}
					</div>
				</div>
			</div>

			<div className='border-t p-4 space-y-2'>
				{saveError && <p className='font-montserrat text-xs font-light text-destructive'>{saveError}</p>}
				<Button onClick={() => void handleSave()} disabled={isSaving} className='w-full font-montserrat font-semibold'>
					{isSaving ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Saving...
						</>
					) : (
						<>
							<Save className='mr-2 h-4 w-4' />
							Save Changes
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
