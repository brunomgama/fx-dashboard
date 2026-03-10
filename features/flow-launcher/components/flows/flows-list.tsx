'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useFlowLauncherAPI } from '../../hooks/use-flow-launcher-api';
import { Flow } from '../../types';
import { FlowDetailsPanel } from './flow-details-panel';

export function FlowsList() {
	const api = useFlowLauncherAPI();
	const [flows, setFlows] = useState<Flow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

	const loadFlows = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const response = await api.listFlows({ limit: 100 });
			const flowData = response.results || response.Items || response.items || [];
			setFlows(flowData);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load flows');
		} finally {
			setLoading(false);
		}
	}, [api]);

	useEffect(() => {
		loadFlows();
	}, [loadFlows]);

	const handleDeleteFlow = async (flow: Flow) => {
		if (!confirm(`Are you sure you want to delete flow "${flow.name}"?`)) return;
		try {
			await api.deleteFlow(flow.id);
			if (selectedFlow?.id === flow.id) setSelectedFlow(null);
			await loadFlows();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete flow');
		}
	};

	const filteredFlows = flows.filter((flow) => flow.name.toLowerCase().includes(searchQuery.toLowerCase()) || flow.description?.toLowerCase().includes(searchQuery.toLowerCase()));

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
				<Button onClick={loadFlows}>Retry</Button>
			</div>
		);
	}

	return (
		<div className='flex h-full gap-6'>
			{/* Left — flows list (1/3) */}
			<div className='w-1/3 flex flex-col min-w-0'>
				{/* Header section */}
				<div className='space-y-4 mb-6'>
					<div className='flex items-center justify-between'>
						<div>
							<h2 className='text-2xl font-bold tracking-tight'>Flows</h2>
							<p className='text-sm text-muted-foreground mt-1'>Manage and monitor your AWS Step Functions</p>
						</div>
						<div className='text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md'>
							{filteredFlows.length} of {flows.length} {flows.length !== 1 ? 'flows' : 'flow'}
						</div>
					</div>

					{/* Search bar */}
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input placeholder='Search by name or description...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
					</div>
				</div>

				{/* Flows list */}
				<div className='flex-1 min-h-0 overflow-y-auto space-y-2 pr-2'>
					{filteredFlows.map((flow) => (
						<div key={flow.id} onClick={() => setSelectedFlow(flow)} className={`group relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedFlow?.id === flow.id ? 'border-primary bg-primary/5 shadow-sm' : 'hover:border-primary/50'}`}>
							<div className='flex items-start gap-3'>
								<div className='flex-1 min-w-0 space-y-2'>
									{/* Title and description */}
									<div>
										<h3 className='font-semibold text-base truncate'>{flow.name}</h3>
										<p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{flow.description || 'No description provided'}</p>
									</div>

									{/* Variables tags */}
									{flow.variables && flow.variables.length > 0 && (
										<div className='flex flex-wrap gap-1.5'>
											{flow.variables.slice(0, 3).map((variable) => (
												<span key={variable} className='px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-md'>
													{variable}
												</span>
											))}
											{flow.variables.length > 3 && <span className='px-2 py-0.5 text-xs text-muted-foreground'>+{flow.variables.length - 3} more</span>}
										</div>
									)}

									{/* Metadata */}
									<div className='flex items-center gap-4 text-xs text-muted-foreground'>
										<span className='font-mono truncate max-w-[150px]' title={flow.id}>
											ID: {flow.id}
										</span>
									</div>
								</div>

								{/* Actions */}
								<div className='flex items-center gap-2 flex-shrink-0'>
									<Button
										size='sm'
										variant='ghost'
										className='h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10'
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteFlow(flow);
										}}>
										<Trash2 className='h-4 w-4' />
									</Button>
									<ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedFlow?.id === flow.id ? 'rotate-0' : 'group-hover:translate-x-0.5'}`} />
								</div>
							</div>

							{/* ARN - shown on hover or when selected */}
							<div className={`mt-2 pt-2 border-t transition-opacity ${selectedFlow?.id === flow.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
								<p className='text-xs font-mono text-muted-foreground truncate' title={flow.arn}>
									{flow.arn}
								</p>
							</div>
						</div>
					))}

					{filteredFlows.length === 0 && (
						<div className='flex flex-col items-center justify-center py-16 text-center'>
							<Search className='h-12 w-12 text-muted-foreground/50 mb-4' />
							<p className='text-muted-foreground font-medium'>No flows found</p>
							<p className='text-sm text-muted-foreground mt-1'>{searchQuery ? 'Try adjusting your search' : 'No flows available'}</p>
						</div>
					)}
				</div>
			</div>

			{/* Right — details panel (2/3) - Always visible */}
			<div className='w-2/3 flex-shrink-0'>
				{selectedFlow ? (
					<FlowDetailsPanel flow={selectedFlow} onClose={() => setSelectedFlow(null)} onUpdate={loadFlows} />
				) : (
					<div className='flex flex-col h-full rounded-lg border bg-card shadow-sm'>
						<div className='flex items-center justify-between p-4 border-b bg-muted/30'>
							<div className='flex-1 min-w-0'>
								<h2 className='text-lg font-semibold truncate'>Flow Details</h2>
								<p className='text-xs text-muted-foreground truncate mt-0.5'>Select a flow to view details</p>
							</div>
						</div>
						<div className='flex-1 flex items-center justify-center p-8'>
							<div className='text-center max-w-md'>
								<div className='mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4'>
									<ChevronRight className='h-8 w-8 text-muted-foreground/50' />
								</div>
								<h3 className='text-lg font-semibold mb-2'>No Flow Selected</h3>
								<p className='text-sm text-muted-foreground'>Select a flow from the list on the left to view its details, edit information, and visualize the state machine.</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
