'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { flowLauncherAPI } from '../../api';
import { EventConfig } from '../../types';
import { CreateEventConfigModal } from './create-event-config-modal';

export function EventConfigsList() {
	const { environmentConfig, fullConfig } = useFlowLauncher();
	const [configs, setConfigs] = useState<EventConfig[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState('');
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [selectedConfig, setSelectedConfig] = useState<EventConfig | null>(null);

	const loadConfigs = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const response = await flowLauncherAPI.listEventConfigs(environmentConfig, { limit: 100 });
			// Support multiple response formats (results, Items, items)
			const configData = response.results || response.Items || response.items || [];
			console.log('Loaded configs:', configData.length, 'configs from', fullConfig.displayName);
			setConfigs(configData);
		} catch (err) {
			console.error('Error loading configs:', err);
			setError(err instanceof Error ? err.message : 'Failed to load event configs');
		} finally {
			setLoading(false);
		}
	}, [environmentConfig]);

	useEffect(() => {
		loadConfigs();
	}, [loadConfigs]);

	const handleDeleteConfig = async (config: EventConfig) => {
		if (!confirm(`Are you sure you want to delete config for event "${config.id}"?`)) return;

		try {
			await flowLauncherAPI.deleteEventConfig(environmentConfig, config.id);
			await loadConfigs();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete config');
		}
	};

	const handleEditConfig = (config: EventConfig) => {
		setSelectedConfig(config);
		setShowCreateModal(true);
	};

	const filteredConfigs = configs.filter((config) => config.id.toLowerCase().includes(searchQuery.toLowerCase()));

	if (loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col items-center justify-center h-64 gap-4'>
				<p className='text-destructive'>{error}</p>
				<Button onClick={loadConfigs}>Retry</Button>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-4'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input placeholder='Search configs...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
				</div>
				<Button
					onClick={() => {
						setSelectedConfig(null);
						setShowCreateModal(true);
					}}>
					<Plus className='mr-2 h-4 w-4' />
					Create Config
				</Button>
			</div>

			<div className='space-y-3'>
				{filteredConfigs.map((config) => (
					<div key={config.id} className='border rounded-lg p-4 space-y-2'>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<h3 className='font-semibold'>Event ID: {config.id}</h3>
							</div>
							<div className='flex gap-2'>
								<Button size='sm' variant='outline' onClick={() => handleEditConfig(config)}>
									<Pencil className='h-4 w-4' />
								</Button>
								<Button size='sm' variant='destructive' onClick={() => handleDeleteConfig(config)}>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</div>

						<div className='bg-secondary p-3 rounded-lg'>
							<p className='text-xs font-semibold mb-1'>Default Values:</p>
							<pre className='text-xs font-mono whitespace-pre-wrap break-all'>{JSON.stringify(JSON.parse(config.defaults || '{}'), null, 2)}</pre>
						</div>
					</div>
				))}
			</div>

			{filteredConfigs.length === 0 && <div className='text-center py-12 text-muted-foreground'>No event configs found</div>}

			{showCreateModal && (
				<CreateEventConfigModal
					open={showCreateModal}
					config={selectedConfig}
					onClose={() => {
						setShowCreateModal(false);
						setSelectedConfig(null);
					}}
					onSuccess={loadConfigs}
				/>
			)}
		</div>
	);
}
