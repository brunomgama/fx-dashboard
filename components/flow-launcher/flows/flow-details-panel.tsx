'use client';

import { Button } from '@/components/ui/button';
import { useFlowLauncherConfig } from '@/hooks/use-flow-launcher-config';
import type { Flow } from '@/types/flow-launcher';
import { Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { FlowBasicInfo } from './flow-basic-info';
import { FlowTechnicalDetails } from './flow-technical-details';
import { StateMachineVisualization } from './state-machine-visualization';

interface FlowDetailsPanelProps {
	flow: Flow;
	onClose: () => void;
	onUpdate: () => void;
}

export function FlowDetailsPanel({ flow, onClose, onUpdate }: FlowDetailsPanelProps) {
	const { awsProfile, awsRegion, environment } = useFlowLauncherConfig();
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState('');
	const [name, setName] = useState(flow.name);
	const [description, setDescription] = useState(flow.description ?? '');

	const handleSave = async () => {
		setIsSaving(true);
		setSaveError('');
		try {
			const res = await fetch(`/api/flow-launcher/flows/${flow.id}?environment=${environment}`, {
				body: JSON.stringify({ description, name, user: 'dashboard-user' }),
				headers: { 'Content-Type': 'application/json' },
				method: 'PUT',
			});
			if (!res.ok) {
				const err = (await res.json()) as { error: string };
				throw new Error(err.error);
			}
			onUpdate();
		} catch (err) {
			setSaveError(err instanceof Error ? err.message : 'Failed to save');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='flex h-full flex-col rounded-lg border bg-card shadow-sm'>
			<div className='flex items-center justify-between border-b bg-muted/30 p-4'>
				<div className='min-w-0 flex-1'>
					<h2 className='font-montserrat truncate text-lg font-black'>Flow Details</h2>
					<p className='mt-0.5 truncate font-montserrat text-xs font-light text-muted-foreground'>{flow.name}</p>
				</div>
				<Button variant='ghost' size='sm' onClick={onClose} className='shrink-0'>
					<X className='h-4 w-4' />
				</Button>
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-5'>
				<FlowBasicInfo name={name} description={description} onNameChange={setName} onDescriptionChange={setDescription} />
				<FlowTechnicalDetails flow={flow} />
				<StateMachineVisualization flowArn={flow.arn} awsProfile={awsProfile} region={awsRegion} />
			</div>

			<div className='border-t bg-muted/30 p-4 space-y-2'>
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
