'use client';

import { Button } from '@/components/ui/button';
import { parseASL } from '@/lib/asl-parser';
import { Background, Controls, type Edge, type Node, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { StateNode } from './state-machine-node';

const nodeTypes = { stateNode: StateNode };

interface Props {
	flowArn: string;
	awsProfile: string;
	region: string;
}

export function StateMachineVisualization({ flowArn, awsProfile, region }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const load = useCallback(async () => {
		setIsLoading(true);
		setError('');
		try {
			const res = await fetch('/api/step-function/describe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ arn: flowArn, profile: awsProfile, region }),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.details || err.error || 'Failed to fetch definition');
			}
			const data = await res.json();
			const { nodes: n, edges: e } = parseASL(data.definition);
			setNodes(n);
			setEdges(e);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load state machine');
		} finally {
			setIsLoading(false);
		}
	}, [flowArn, awsProfile, region]);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<div className='space-y-3'>
			<h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>State Machine</h3>

			{isLoading && (
				<div className='flex h-64 items-center justify-center rounded-lg border bg-muted/20'>
					<div className='flex flex-col items-center gap-3'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
						<p className='text-sm text-muted-foreground'>Loading...</p>
					</div>
				</div>
			)}

			{error && (
				<div className='flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5'>
					<p className='text-sm font-medium text-destructive'>Failed to load definition</p>
					<p className='max-w-[90%] text-center text-xs text-muted-foreground'>{error}</p>
					<Button size='sm' variant='outline' onClick={load}>
						Retry
					</Button>
				</div>
			)}

			{!isLoading && !error && nodes.length > 0 && (
				<div className='overflow-hidden rounded-lg border bg-muted/10' style={{ height: 420 }}>
					<ReactFlowProvider>
						<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} proOptions={{ hideAttribution: true }}>
							<Background />
							<Controls />
						</ReactFlow>
					</ReactFlowProvider>
				</div>
			)}

			{!isLoading && !error && nodes.length === 0 && (
				<div className='flex h-40 items-center justify-center rounded-lg border bg-muted/20'>
					<p className='text-sm text-muted-foreground'>No states found</p>
				</div>
			)}
		</div>
	);
}
