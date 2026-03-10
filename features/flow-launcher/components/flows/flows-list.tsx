'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { flowsApi } from '../../api';
import { useFlowLauncherConfig } from '../../hooks/use-flow-launcher-config';
import type { Flow } from '../../types';
import { FlowDetailsPanel } from './flow-details-panel';

export function FlowsList() {
	const { apiConfig } = useFlowLauncherConfig();
	const [flows, setFlows] = useState<Flow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Flow | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const res = await flowsApi.list(apiConfig, { limit: 100 });
			setFlows(res.results ?? res.items ?? res.Items ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load flows');
		} finally {
			setLoading(false);
		}
	}, [apiConfig]);

	useEffect(() => {
		load();
	}, [load]);

	const handleDelete = async (flow: Flow) => {
		if (!confirm(`Delete flow "${flow.name}"?`)) return;
		try {
			await flowsApi.delete(apiConfig, flow.id);
			if (selected?.id === flow.id) setSelected(null);
			await load();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete flow');
		}
	};

	const filtered = flows.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.description?.toLowerCase().includes(search.toLowerCase()));

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
		<div className='flex h-full gap-6'>
			{/* List — 1/3 */}
			<div className='flex w-1/3 min-w-0 flex-col'>
				<div className='mb-4 space-y-3'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-muted-foreground'>
							{filtered.length} of {flows.length} flows
						</p>
					</div>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10' />
					</div>
				</div>

				<div className='flex-1 space-y-2 overflow-y-auto pr-2'>
					{filtered.map((flow) => (
						<div key={flow.id} onClick={() => setSelected(flow)} className={`group cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${selected?.id === flow.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
							<div className='flex items-start gap-3'>
								<div className='min-w-0 flex-1 space-y-1'>
									<h3 className='truncate font-semibold'>{flow.name}</h3>
									<p className='line-clamp-2 text-sm text-muted-foreground'>{flow.description ?? 'No description'}</p>
									{flow.variables && flow.variables.length > 0 && (
										<div className='flex flex-wrap gap-1'>
											{flow.variables.slice(0, 3).map((v) => (
												<span key={v} className='rounded-md bg-secondary px-2 py-0.5 text-xs'>
													{v}
												</span>
											))}
											{flow.variables.length > 3 && <span className='text-xs text-muted-foreground'>+{flow.variables.length - 3}</span>}
										</div>
									)}
								</div>
								<div className='flex shrink-0 items-center gap-1'>
									<Button
										size='sm'
										variant='ghost'
										className='h-8 w-8 p-0 text-destructive hover:bg-destructive/10'
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(flow);
										}}>
										<Trash2 className='h-4 w-4' />
									</Button>
									<ChevronRight className='h-5 w-5 text-muted-foreground' />
								</div>
							</div>
						</div>
					))}

					{filtered.length === 0 && (
						<div className='flex flex-col items-center justify-center py-16 text-center'>
							<Search className='mb-4 h-12 w-12 text-muted-foreground/50' />
							<p className='text-muted-foreground'>No flows found</p>
						</div>
					)}
				</div>
			</div>

			{/* Details — 2/3 */}
			<div className='w-2/3 shrink-0'>
				{selected ? (
					<FlowDetailsPanel flow={selected} onClose={() => setSelected(null)} onUpdate={load} />
				) : (
					<div className='flex h-full flex-col items-center justify-center rounded-lg border bg-card'>
						<ChevronRight className='mb-4 h-12 w-12 text-muted-foreground/30' />
						<p className='font-semibold'>No Flow Selected</p>
						<p className='mt-1 text-sm text-muted-foreground'>Select a flow from the list to view details</p>
					</div>
				)}
			</div>
		</div>
	);
}
