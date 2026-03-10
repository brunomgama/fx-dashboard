'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Pencil, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { eventConfigsApi } from '../../api';
import { useFlowLauncherConfig } from '../../hooks/use-flow-launcher-config';
import type { EventConfig } from '../../types';

export function EventConfigsList() {
	const { apiConfig } = useFlowLauncherConfig();
	const [configs, setConfigs] = useState<EventConfig[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [editing, setEditing] = useState<EventConfig | null>(null);
	const [showCreate, setShowCreate] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const res = await eventConfigsApi.list(apiConfig, { limit: 100 });
			setConfigs(res.results ?? res.items ?? res.Items ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load configs');
		} finally {
			setLoading(false);
		}
	}, [apiConfig]);

	useEffect(() => {
		load();
	}, [load]);

	const handleDelete = async (config: EventConfig) => {
		if (!confirm(`Delete config for event "${config.id}"?`)) return;
		try {
			await eventConfigsApi.delete(apiConfig, config.id);
			await load();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete');
		}
	};

	const filtered = configs.filter((c) => c.id.toLowerCase().includes(search.toLowerCase()));

	if (loading)
		return (
			<div className='flex h-64 items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
			</div>
		);
	if (error)
		return (
			<div className='flex h-64 flex-col items-center justify-center gap-4'>
				<p className='text-destructive'>{error}</p>
				<Button onClick={load}>Retry</Button>
			</div>
		);

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-3'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input placeholder='Search configs...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
				</div>
			</div>

			<div className='space-y-3'>
				{filtered.map((config) => (
					<div key={config.id} className='space-y-2 rounded-lg border p-4'>
						<div className='flex items-start justify-between'>
							<h3 className='font-semibold'>Event ID: {config.id}</h3>
							<div className='flex gap-2'>
								<Button
									size='sm'
									variant='outline'
									onClick={() => {
										setEditing(config);
									}}>
									<Pencil className='h-4 w-4' />
								</Button>
								<Button size='sm' variant='destructive' onClick={() => handleDelete(config)}>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</div>
						<div className='rounded-lg bg-secondary p-3'>
							<p className='mb-1 text-xs font-semibold'>Default Values:</p>
							<pre className='whitespace-pre-wrap break-all font-mono text-xs'>{JSON.stringify(JSON.parse(config.defaults || '{}'), null, 2)}</pre>
						</div>
					</div>
				))}
				{filtered.length === 0 && <div className='py-12 text-center text-muted-foreground'>No event configs found</div>}
			</div>
		</div>
	);
}
