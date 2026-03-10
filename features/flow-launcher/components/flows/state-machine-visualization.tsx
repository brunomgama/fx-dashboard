'use client';

import { Button } from '@/components/ui/button';
import { parseASL } from '@/lib/asl-parser';
import { Background, Controls, Edge, Node, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { StateNode } from './state-machine-node';

const nodeTypes = { stateNode: StateNode };

interface StateMachineVisualizationProps {
	flowArn: string;
	awsProfile: string;
	region: string;
}

export function StateMachineVisualization({ flowArn, awsProfile, region }: StateMachineVisualizationProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [nodes, setNodes] = useState<Node[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const loadDefinition = useCallback(async () => {
		setIsLoading(true);
		setError('');
		try {
			const res = await fetch('/api/step-function/describe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					arn: flowArn,
					profile: awsProfile,
					region: region,
				}),
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
		loadDefinition();
	}, [loadDefinition]);

	return (
		<div className='space-y-3'>
			<h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>State Machine Visualization</h3>

			{isLoading && (
				<div className='flex items-center justify-center h-64 border rounded-lg bg-muted/20'>
					<div className='flex flex-col items-center gap-3'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
						<p className='text-sm text-muted-foreground'>Loading state machine...</p>
					</div>
				</div>
			)}

			{error && (
				<div className='flex flex-col items-center justify-center h-48 border border-destructive/50 rounded-lg bg-destructive/5 gap-3'>
					<p className='text-sm text-destructive font-medium'>Failed to load definition</p>
					<p className='text-xs text-muted-foreground max-w-[90%] text-center'>{error}</p>
					<Button size='sm' variant='outline' onClick={loadDefinition}>
						Retry
					</Button>
				</div>
			)}

			{!isLoading && !error && nodes.length > 0 && (
				<div className='border rounded-lg overflow-hidden bg-muted/10' style={{ height: 420 }}>
					<ReactFlowProvider>
						<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} proOptions={{ hideAttribution: true }}>
							<Background />
							<Controls />
						</ReactFlow>
					</ReactFlowProvider>
				</div>
			)}

			{!isLoading && !error && nodes.length === 0 && (
				<div className='flex flex-col items-center justify-center h-40 border rounded-lg bg-muted/20'>
					<p className='text-sm text-muted-foreground'>No states found in this flow</p>
				</div>
			)}
		</div>
	);
}
