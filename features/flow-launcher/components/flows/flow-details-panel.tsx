'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { flowLauncherAPI } from '../../api';
import { Flow } from '../../types';
import { FlowBasicInfo } from './flow-basic-info';
import { FlowTechnicalDetails } from './flow-technical-details';
import { StateMachineVisualization } from './state-machine-visualization';

interface FlowDetailsPanelProps {
	flow: Flow;
	onClose: () => void;
	onUpdate: () => void;
}

export function FlowDetailsPanel({ flow, onClose, onUpdate }: FlowDetailsPanelProps) {
	const { environmentConfig, fullConfig } = useFlowLauncher();
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState(flow.name);
	const [description, setDescription] = useState(flow.description || '');

	// Reset form when flow changes
	useEffect(() => {
		setName(flow.name);
		setDescription(flow.description || '');
	}, [flow.id, flow.name, flow.description]);

	const handleSave = async () => {
		if (!environmentConfig) return;
		setIsSaving(true);
		try {
			await flowLauncherAPI.updateFlow(environmentConfig, flow.id, {
				user: 'system@fixxer.eu',
				name,
				description,
			});
			onUpdate();
		} catch (err) {
			console.error('Failed to update flow:', err);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='flex flex-col h-full rounded-lg border bg-card shadow-sm'>
			{/* Header */}
			<div className='flex items-center justify-between p-4 border-b bg-muted/30'>
				<div className='flex-1 min-w-0'>
					<h2 className='text-lg font-semibold truncate'>Flow Details</h2>
					<p className='text-xs text-muted-foreground truncate mt-0.5'>{flow.name}</p>
				</div>
				<Button variant='ghost' size='sm' onClick={onClose} className='flex-shrink-0'>
					<X className='h-4 w-4' />
				</Button>
			</div>

			{/* Content */}
			<div className='flex-1 overflow-y-auto p-5 space-y-6'>
				<FlowBasicInfo name={name} description={description} onNameChange={setName} onDescriptionChange={setDescription} />

				<FlowTechnicalDetails flow={flow} />

				<StateMachineVisualization flowArn={flow.arn} awsProfile={fullConfig.awsProfile} region={fullConfig.region} />
			</div>

			{/* Save Button - Fixed at bottom */}
			<div className='p-4 border-t bg-muted/30'>
				<Button onClick={handleSave} disabled={isSaving} className='w-full'>
					{isSaving ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Saving Changes...
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
