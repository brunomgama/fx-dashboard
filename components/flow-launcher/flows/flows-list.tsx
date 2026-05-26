'use client';

import { ErrorComponent } from '@/components/error/error';
import { LoadingComponent } from '@/components/loading/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFlowLauncherConfig } from '@/hooks/use-flow-launcher-config';
import type { Flow, ListResponse } from '@/types/flow-launcher';
import { ChevronRight, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { FlowDetailsPanel } from './flow-details-panel';

export function FlowsList() {
	const { environment } = useFlowLauncherConfig();
	const [flows, setFlows] = useState<Flow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Flow | null>(null);

	const load = useCallback(() => {
		fetch(`/api/flow-launcher/flows?environment=${environment}`)
			.then(async (res) => {
				if (!res.ok) {
					const err = (await res.json()) as { error: string };
					throw new Error(err.error);
				}
				return res.json() as Promise<ListResponse<Flow>>;
			})
			.then((data) => {
				setFlows(data.results ?? data.items ?? data.Items ?? []);
				setError('');
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : 'Failed to load flows');
			})
			.finally(() => setLoading(false));
	}, [environment]);

	useEffect(() => {
		load();
	}, [load]);

	const handleDelete = async (flow: Flow) => {
		try {
			const res = await fetch(`/api/flow-launcher/flows/${flow.id}?environment=${environment}`, { method: 'DELETE' });
			if (!res.ok) {
				const err = (await res.json()) as { error: string };
				throw new Error(err.error);
			}
			if (selected?.id === flow.id) setSelected(null);
			await load();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete flow');
		}
	};

	const filtered = flows.filter(
		(f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.description?.toLowerCase().includes(search.toLowerCase()),
	);

	if (loading) return <LoadingComponent />;

	if (error) return <ErrorComponent message={error} onRetry={() => { setLoading(true); load(); }} />;

	return (
		<div className='flex h-full gap-6'>
			<div className='flex w-1/3 min-w-0 flex-col'>
				<div className='mb-4 space-y-3'>
					<p className='font-montserrat text-sm font-light text-muted-foreground'>
						{filtered.length} of {flows.length} flows
					</p>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} className='pl-10 font-montserrat font-light' />
					</div>
				</div>

				<div className='flex-1 space-y-2 overflow-y-auto pr-2'>
					{filtered.map((flow) => (
						<div
							key={flow.id}
							onClick={() => setSelected(flow)}
							className={`group cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${selected?.id === flow.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
						>
							<div className='flex items-start gap-3'>
								<div className='min-w-0 flex-1 space-y-1'>
									<h3 className='truncate font-montserrat font-semibold'>{flow.name}</h3>
									<p className='line-clamp-2 font-montserrat text-sm font-light text-muted-foreground'>{flow.description ?? 'No description'}</p>
									{flow.variables && flow.variables.length > 0 && (
										<div className='flex flex-wrap gap-1'>
											{flow.variables.slice(0, 3).map((v) => (
												<span key={v} className='rounded-md bg-secondary px-2 py-0.5 font-montserrat text-xs font-light'>
													{v}
												</span>
											))}
											{flow.variables.length > 3 && <span className='font-montserrat text-xs font-light text-muted-foreground'>+{flow.variables.length - 3}</span>}
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
											void handleDelete(flow);
										}}
									>
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
							<p className='font-montserrat font-light text-muted-foreground'>No flows found</p>
						</div>
					)}
				</div>
			</div>

			<div className='w-2/3 shrink-0'>
				{selected ? (
					<FlowDetailsPanel key={selected.id} flow={selected} onClose={() => setSelected(null)} onUpdate={() => load()} />
				) : (
					<div className='flex h-full flex-col items-center justify-center rounded-lg border bg-card'>
						<ChevronRight className='mb-4 h-12 w-12 text-muted-foreground/30' />
						<p className='font-montserrat font-semibold'>No Flow Selected</p>
						<p className='mt-1 font-montserrat text-sm font-light text-muted-foreground'>Select a flow from the list to view details</p>
					</div>
				)}
			</div>
		</div>
	);
}
