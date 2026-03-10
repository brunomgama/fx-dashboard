'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Copy, Loader2, Save, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { eventConfigsApi, eventsApi, flowsApi } from '../../api';
import { useFlowLauncherConfig } from '../../hooks/use-flow-launcher-config';
import type { Event, Flow } from '../../types';

interface Props {
	event: Event;
	onClose: () => void;
	onUpdate: () => void;
}

export function EventDetailsPanel({ event, onClose, onUpdate }: Props) {
	const { apiConfig } = useFlowLauncherConfig();
	const [isSaving, setIsSaving] = useState(false);
	const [isLoadingFlows, setIsLoadingFlows] = useState(false);
	const [flows, setFlows] = useState<Flow[]>([]);
	const [description, setDescription] = useState(event.description ?? '');
	const [selectedFlowIds, setSelectedFlowIds] = useState<string[]>(event.flow_ids ?? []);
	const [defaultVariables, setDefaultVariables] = useState(event.input ?? '{}');
	const [jsonError, setJsonError] = useState('');
	const [copied, setCopied] = useState(false);

	const handleCopyId = () => {
		navigator.clipboard.writeText(event.id);
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

	const loadData = useCallback(async () => {
		setIsLoadingFlows(true);
		try {
			const [flowsRes, configRes] = await Promise.allSettled([flowsApi.list(apiConfig, { limit: 1000 }), eventConfigsApi.get(apiConfig, event.id)]);

			const loadedFlows = flowsRes.status === 'fulfilled' ? flowsRes.value.results ?? flowsRes.value.items ?? flowsRes.value.Items ?? [] : [];
			setFlows(loadedFlows);

			const existingDefaults = configRes.status === 'fulfilled' ? JSON.parse(configRes.value.defaults ?? '{}') : {};

			const selected = loadedFlows.filter((f: Flow) => event.flow_ids?.includes(f.id));
			const vars = new Set(selected.flatMap((f: Flow) => f.variables ?? []));
			const json: Record<string, string> = {};
			vars.forEach((v) => {
				json[v] = existingDefaults[v] ?? '';
			});
			setDefaultVariables(JSON.stringify(json, null, 2));
		} catch (err) {
			console.error('Failed to load data:', err);
		} finally {
			setIsLoadingFlows(false);
		}
	}, [apiConfig, event.id, event.flow_ids]);

	useEffect(() => {
		setDescription(event.description ?? '');
		setSelectedFlowIds(event.flow_ids ?? []);
		loadData();
	}, [event.id]);

	const toggleFlow = (flowId: string) => {
		const next = selectedFlowIds.includes(flowId) ? selectedFlowIds.filter((id) => id !== flowId) : [...selectedFlowIds, flowId];

		setSelectedFlowIds(next);

		const selected = flows.filter((f) => next.includes(f.id));
		const vars = new Set(selected.flatMap((f) => f.variables ?? []));

		try {
			const current = JSON.parse(defaultVariables ?? '{}');
			vars.forEach((v) => {
				if (!(v in current)) current[v] = '';
			});
			Object.keys(current).forEach((k) => {
				if (!vars.has(k) && current[k] === '') delete current[k];
			});
			setDefaultVariables(JSON.stringify(current, null, 2));
			setJsonError('');
		} catch {
			/* JSON currently invalid, skip merge */
		}
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await eventsApi.update(apiConfig, event.id, {
				user: 'dashboard-user',
				description,
				flow_ids: selectedFlowIds,
				input: defaultVariables,
			});

			try {
				await eventConfigsApi.update(apiConfig, event.id, { user: 'dashboard-user', defaults: defaultVariables });
			} catch {
				await eventConfigsApi.create(apiConfig, { user: 'dashboard-user', id: event.id, defaults: defaultVariables });
			}

			onUpdate();
		} catch (err) {
			console.error('Save failed:', err);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='flex h-full flex-col border-l bg-background'>
			<div className='flex items-center justify-between border-b p-4'>
				<h2 className='text-lg font-semibold'>Event Details</h2>
				<Button variant='ghost' size='sm' onClick={onClose}>
					<X className='h-4 w-4' />
				</Button>
			</div>

			<div className='flex-1 space-y-5 overflow-y-auto p-4'>
				{/* ID */}
				<div className='space-y-1.5'>
					<div className='flex items-center justify-between'>
						<Label className='text-xs text-muted-foreground'>ID</Label>
						<Button variant='ghost' size='sm' className='h-5 w-5 p-0 text-muted-foreground/50' onClick={handleCopyId}>
							{copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
						</Button>
					</div>
					<Input value={event.id} disabled className='font-mono text-sm' />
				</div>

				{/* Description */}
				<div className='space-y-1.5'>
					<Label>Description</Label>
					<Textarea value={description} onChange={(e) => setDescription(e.target.value)} className='min-h-[80px]' placeholder='Add a description...' />
				</div>

				{/* Flows */}
				<div className='space-y-1.5'>
					<Label>Flows ({selectedFlowIds.length} selected)</Label>
					{isLoadingFlows ? (
						<div className='flex items-center justify-center p-8'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					) : (
						<div className='max-h-[20rem] space-y-2 overflow-y-auto rounded-md border p-3'>
							{flows.map((flow) => (
								<div key={flow.id} className='flex items-center gap-3'>
									<Checkbox id={`flow-${flow.id}`} checked={selectedFlowIds.includes(flow.id)} onCheckedChange={() => toggleFlow(flow.id)} />
									<div className='flex-1'>
										<label htmlFor={`flow-${flow.id}`} className='cursor-pointer text-sm font-medium'>
											{flow.name}
										</label>
										{flow.description && <p className='text-xs text-muted-foreground'>{flow.description}</p>}
									</div>
								</div>
							))}
							{flows.length === 0 && <p className='text-center text-sm text-muted-foreground'>No flows available</p>}
						</div>
					)}
				</div>

				{/* Default Variables */}
				<div className='space-y-1.5'>
					<div className='flex items-center justify-between'>
						<Label>Default Variables</Label>
						{jsonError ? <span className='text-xs text-destructive'>Invalid JSON</span> : <span className='text-xs text-muted-foreground'>JSON</span>}
					</div>
					<div className={`rounded-md border bg-muted/50 ${jsonError ? 'border-destructive' : ''}`}>
						<Textarea value={defaultVariables} onChange={(e) => handleJsonChange(e.target.value)} className='min-h-[160px] resize-none border-0 bg-transparent font-mono text-sm focus-visible:ring-0' spellCheck={false} />
					</div>
					{jsonError && <p className='font-mono text-xs text-destructive'>{jsonError}</p>}
				</div>
			</div>

			<div className='border-t p-4'>
				<Button onClick={handleSave} disabled={isSaving} className='w-full'>
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
