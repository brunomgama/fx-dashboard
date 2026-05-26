'use client';

import { Button } from '@/components/ui/button';
import { parseASL } from '@/lib/asl-parser';
import { Background, Controls, type Edge, type Node, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { StateNode } from './state-machine-node';

const nodeTypes = { stateNode: StateNode };

interface StateMachineVisualizationProps {
	awsProfile: string;
	flowArn: string;
	region: string;
}

export function StateMachineVisualization({ awsProfile, flowArn, region }: StateMachineVisualizationProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const load = useCallback(() => {
		fetch('/api/step-function/describe', {
			body: JSON.stringify({ arn: flowArn, profile: awsProfile, region }),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		})
			.then(async (res) => {
				if (!res.ok) {
					const err = (await res.json()) as { details?: string; error?: string };
					throw new Error(err.details ?? err.error ?? 'Failed to fetch definition');
				}
				return res.json() as Promise<{ definition: string }>;
			})
			.then((data) => {
				const { edges: e, nodes: n } = parseASL(data.definition);
				setNodes(n);
				setEdges(e);
				setError('');
			})
			.catch((err) => {
				setError(err instanceof Error ? err.message : 'Failed to load state machine');
			})
			.finally(() => setIsLoading(false));
	}, [flowArn, awsProfile, region]);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<div className='space-y-3'>
			<h3 className='font-montserrat text-sm font-black uppercase tracking-wide text-muted-foreground'>State Machine</h3>

			{isLoading && (
				<div className='flex h-64 items-center justify-center rounded-lg border bg-muted/20'>
					<div className='flex flex-col items-center gap-3'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
						<p className='font-montserrat text-sm font-light text-muted-foreground'>Loading...</p>
					</div>
				</div>
			)}

			{error && (
				<div className='flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5'>
					<p className='font-montserrat text-sm font-semibold text-destructive'>Failed to load definition</p>
					<p className='max-w-[90%] text-center font-montserrat text-xs font-light text-muted-foreground'>{error}</p>
					<Button size='sm' variant='outline' onClick={() => { setIsLoading(true); load(); }}>
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
					<p className='font-montserrat text-sm font-light text-muted-foreground'>No states found</p>
				</div>
			)}
		</div>
	);
}
