'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { flowLauncherAPI } from '@/lib/flow-launcher-api';
import { Event, Flow } from '@/types/flow-launcher';
import { Check, Copy, Loader2, Save, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface EventDetailsPanelProps {
	event: Event;
	onClose: () => void;
	onUpdate: () => void;
}

export function EventDetailsPanel({ event, onClose, onUpdate }: EventDetailsPanelProps) {
	const { environmentConfig } = useFlowLauncher();
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [flows, setFlows] = useState<Flow[]>([]);

	const [description, setDescription] = useState(event.description || '');
	const [selectedFlowIds, setSelectedFlowIds] = useState<string[]>(event.flow_ids || []);
	const [defaultVariables, setDefaultVariables] = useState(event.input || '{}');
	const [jsonError, setJsonError] = useState<string>('');
	const [copiedId, setCopiedId] = useState(false);

	const handleCopyId = () => {
		navigator.clipboard.writeText(event.id);
		setCopiedId(true);
		setTimeout(() => setCopiedId(false), 2000);
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
		setDescription(event.description || '');
		setSelectedFlowIds(event.flow_ids || []);
		setJsonError('');
	}, [event.id]);

	const loadFlows = useCallback(async () => {
		if (!environmentConfig) return;
		setIsLoading(true);
		try {
			const [flowsResponse, configResponse] = await Promise.allSettled([flowLauncherAPI.listFlows(environmentConfig, { limit: 1000 }), flowLauncherAPI.getEventConfig(environmentConfig, event.id)]);

			const loadedFlows = flowsResponse.status === 'fulfilled' ? flowsResponse.value.results || flowsResponse.value.items || flowsResponse.value.Items || [] : [];
			setFlows(loadedFlows);

			const selectedFlows = loadedFlows.filter((f: Flow) => event.flow_ids?.includes(f.id));
			const allVariables = new Set(selectedFlows.flatMap((f: Flow) => f.variables || []));

			const existingDefaults = configResponse.status === 'fulfilled' ? JSON.parse(configResponse.value.defaults || '{}') : {};

			const json: Record<string, string> = {};
			allVariables.forEach((v) => {
				json[v] = existingDefaults[v] ?? '';
			});

			setDefaultVariables(JSON.stringify(json, null, 2));
		} catch (error) {
			console.error('Failed to load flows:', error);
		} finally {
			setIsLoading(false);
		}
	}, [environmentConfig, event.id, event.flow_ids]);

	useEffect(() => {
		loadFlows();
	}, [loadFlows]);

	const handleSave = async () => {
		if (!environmentConfig) return;
		setIsSaving(true);
		try {
			await flowLauncherAPI.updateEvent(environmentConfig, event.id, {
				user: 'system@fixxer.eu',
				description,
				flow_ids: selectedFlowIds,
				input: defaultVariables,
			});

			try {
				await flowLauncherAPI.updateEventConfig(environmentConfig, event.id, {
					user: 'system@fixxer.eu',
					defaults: defaultVariables,
				});
			} catch {
				await flowLauncherAPI.createEventConfig(environmentConfig, {
					user: 'system@fixxer.eu',
					id: event.id,
					defaults: defaultVariables,
				});
			}

			console.log('handleSave: success');
			onUpdate();
		} catch (error) {
			console.error('handleSave: failed', error);
		} finally {
			setIsSaving(false);
		}
	};

	const toggleFlow = (flowId: string) => {
		const isRemoving = selectedFlowIds.includes(flowId);
		const newSelectedIds = isRemoving ? selectedFlowIds.filter((id) => id !== flowId) : [...selectedFlowIds, flowId];

		setSelectedFlowIds(newSelectedIds);

		const allSelectedFlows = flows.filter((f) => newSelectedIds.includes(f.id));
		const allVariables = new Set(allSelectedFlows.flatMap((f) => f.variables || []));

		try {
			const current = JSON.parse(defaultVariables || '{}');

			allVariables.forEach((v) => {
				if (!(v in current)) current[v] = '';
			});

			Object.keys(current).forEach((key) => {
				if (!allVariables.has(key) && current[key] === '') {
					delete current[key];
				}
			});

			setDefaultVariables(JSON.stringify(current, null, 2));
			setJsonError('');
		} catch {
			// JSON is currently invalid, skip the merge
		}
	};

	return (
		<div className='flex flex-col h-full border-l bg-background'>
			<div className='flex items-center justify-between p-4 border-b'>
				<h2 className='text-lg font-semibold'>Event Details</h2>
				<Button variant='ghost' size='sm' onClick={onClose}>
					<X className='h-4 w-4' />
				</Button>
			</div>

			<div className='flex-1 overflow-y-auto p-4 space-y-6'>
				{/* ID */}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<Label>ID</Label>
						<Button variant='ghost' size='sm' className='h-5 w-5 p-0 text-muted-foreground/50 hover:text-muted-foreground' onClick={handleCopyId}>
							{copiedId ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
						</Button>
					</div>
					<Input value={event.id} disabled className='font-mono text-sm' />
				</div>

				{/* Description */}
				<div className='space-y-2'>
					<Label htmlFor='description'>Description</Label>
					<Textarea id='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter event description...' className='min-h-[100px]' />
				</div>

				{/* Flows */}
				<FieldSet>
					<FieldLegend variant='label'>Flows ({selectedFlowIds.length} selected)</FieldLegend>
					{isLoading ? (
						<div className='flex items-center justify-center p-8'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					) : flows.length === 0 ? (
						<div className='p-4 text-sm text-muted-foreground text-center border rounded-md'>No flows available</div>
					) : (
						<FieldGroup className='gap-3 max-h-[35rem] overflow-y-auto border rounded-md p-3'>
							{flows.map((flow) => (
								<Field key={flow.id} orientation='horizontal'>
									<Checkbox id={`flow-${flow.id}`} name={`flow-${flow.id}`} checked={selectedFlowIds.includes(flow.id)} onCheckedChange={() => toggleFlow(flow.id)} />
									<div className='flex-1'>
										<FieldLabel htmlFor={`flow-${flow.id}`} className='font-medium text-sm cursor-pointer'>
											{flow.name}
										</FieldLabel>
										{flow.description && <p className='text-xs text-muted-foreground mt-0.5'>{flow.description}</p>}
									</div>
								</Field>
							))}
						</FieldGroup>
					)}
				</FieldSet>

				{/* Default Variables - JSON editor */}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<Label htmlFor='defaultVariables'>Default Variables</Label>
						<div className='flex items-center gap-2'>{jsonError ? <span className='text-xs text-destructive'>Invalid JSON</span> : <span className='text-xs text-muted-foreground'>JSON</span>}</div>
					</div>

					<div className={`relative rounded-md border bg-muted/50 ${jsonError ? 'border-destructive' : 'border-input'}`}>
						<Textarea id='defaultVariables' value={defaultVariables} onChange={(e) => handleJsonChange(e.target.value)} placeholder={'{\n  "key": "value"\n}'} className='min-h-[200px] font-mono text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none' spellCheck={false} />
					</div>

					{jsonError && <p className='text-xs text-destructive font-mono'>{jsonError}</p>}
				</div>
			</div>

			<div className='p-4 border-t'>
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
