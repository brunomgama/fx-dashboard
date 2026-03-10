'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { flowsApi } from '../../api';
import { useFlowLauncherConfig } from '../../hooks/use-flow-launcher-config';
import type { Flow } from '../../types';
import { FlowBasicInfo } from './flow-basic-info';
import { FlowTechnicalDetails } from './flow-technical-details';
import { StateMachineVisualization } from './state-machine-visualization';

interface Props {
	flow: Flow;
	onClose: () => void;
	onUpdate: () => void;
}

export function FlowDetailsPanel({ flow, onClose, onUpdate }: Props) {
	const { apiConfig, envConfig } = useFlowLauncherConfig();
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState(flow.name);
	const [description, setDescription] = useState(flow.description ?? '');

	useEffect(() => {
		setName(flow.name);
		setDescription(flow.description ?? '');
	}, [flow.id, flow.name, flow.description]);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await flowsApi.update(apiConfig, flow.id, { user: 'dashboard-user', name, description });
			onUpdate();
		} catch (err) {
			console.error('Failed to update flow:', err);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='flex h-full flex-col rounded-lg border bg-card shadow-sm'>
			<div className='flex items-center justify-between border-b bg-muted/30 p-4'>
				<div className='min-w-0 flex-1'>
					<h2 className='truncate text-lg font-semibold'>Flow Details</h2>
					<p className='mt-0.5 truncate text-xs text-muted-foreground'>{flow.name}</p>
				</div>
				<Button variant='ghost' size='sm' onClick={onClose} className='shrink-0'>
					<X className='h-4 w-4' />
				</Button>
			</div>

			<div className='flex-1 space-y-6 overflow-y-auto p-5'>
				<FlowBasicInfo name={name} description={description} onNameChange={setName} onDescriptionChange={setDescription} />
				<FlowTechnicalDetails flow={flow} />
				<StateMachineVisualization flowArn={flow.arn} awsProfile={envConfig.awsProfile} region={envConfig.region} />
			</div>

			<div className='border-t bg-muted/30 p-4'>
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
