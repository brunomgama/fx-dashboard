'use client';

import { ErrorComponent } from '@/components/error/error';
import { LoadingComponent } from '@/components/loading/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFlowLauncherConfig } from '@/hooks/use-flow-launcher-config';
import type { EventConfig, ListResponse } from '@/types/flow-launcher';
import { Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function EventConfigsList() {
	const { environment } = useFlowLauncherConfig();
	const [configs, setConfigs] = useState<EventConfig[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');

	const load = useCallback(() => {
		fetch(`/api/flow-launcher/event-configs?environment=${environment}`)
			.then(async (res) => {
				if (!res.ok) {
					const err = (await res.json()) as { error: string };
					throw new Error(err.error);
				}
				return res.json() as Promise<ListResponse<EventConfig>>;
			})
			.then((data) => {
				setConfigs(data.results ?? data.items ?? data.Items ?? []);
				setError('');
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : 'Failed to load configs');
			})
			.finally(() => setLoading(false));
	}, [environment]);

	useEffect(() => {
		load();
	}, [load]);

	const handleDelete = async (config: EventConfig) => {
		try {
			const res = await fetch(`/api/flow-launcher/event-configs/${config.id}?environment=${environment}`, { method: 'DELETE' });
			if (!res.ok) {
				const err = (await res.json()) as { error: string };
				throw new Error(err.error);
			}
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete config');
		}
	};

	const filtered = configs.filter((c) => c.id.toLowerCase().includes(search.toLowerCase()));

	if (loading) return <LoadingComponent />;
	if (error) return <ErrorComponent message={error} onRetry={() => { setLoading(true); load(); }} />;

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-3'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input placeholder='Search configs...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10 font-montserrat font-light' />
				</div>
			</div>

			<div className='space-y-3'>
				{filtered.map((config) => (
					<div key={config.id} className='space-y-2 rounded-lg border p-4'>
						<div className='flex items-start justify-between'>
							<h3 className='font-montserrat font-semibold'>Event ID: {config.id}</h3>
							<Button size='sm' variant='destructive' onClick={() => void handleDelete(config)}>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
						<div className='rounded-lg bg-secondary p-3'>
							<p className='mb-1 font-montserrat text-xs font-semibold'>Default Values:</p>
							<pre className='whitespace-pre-wrap break-all font-mono text-xs font-light'>
								{JSON.stringify(JSON.parse(config.defaults || '{}'), null, 2)}
							</pre>
						</div>
					</div>
				))}
				{filtered.length === 0 && <div className='py-12 text-center font-montserrat font-light text-muted-foreground'>No event configs found</div>}
			</div>
		</div>
	);
}
