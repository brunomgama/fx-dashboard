import { ASLCatch, ASLChoice, ASLDefinition, ASLState } from '@/types/flow-launcher';
import { Edge, Node } from '@xyflow/react';

/**
 * Parse ASL (Amazon States Language) definition and convert to ReactFlow nodes and edges
 */
export function parseASL(definition: string): { nodes: Node[]; edges: Edge[] } {
	let asl: ASLDefinition;
	try {
		asl = JSON.parse(definition) as ASLDefinition;
	} catch {
		return { nodes: [], edges: [] };
	}

	const states: Record<string, ASLState> = asl.States || {};
	const startAt: string = asl.StartAt;

	// BFS to assign depth levels
	const depths: Record<string, number> = {};
	const visited = new Set<string>();
	const queue: string[] = [startAt];
	depths[startAt] = 0;

	while (queue.length > 0) {
		const current = queue.shift()!;
		if (visited.has(current)) continue;
		visited.add(current);

		const state = states[current];
		if (!state) continue;

		const successors: string[] = [];

		if (state.Next) successors.push(state.Next);
		if (state.Choices) state.Choices.forEach((c: ASLChoice) => c.Next && successors.push(c.Next));
		if (state.Default) successors.push(state.Default);
		if (state.Catch) state.Catch.forEach((c: ASLCatch) => c.Next && successors.push(c.Next));

		successors.forEach((next) => {
			if (!(next in depths)) {
				depths[next] = depths[current] + 1;
				queue.push(next);
			}
		});
	}

	// Any states not reachable from start (e.g. orphaned) get depth 0
	Object.keys(states).forEach((name) => {
		if (!(name in depths)) depths[name] = 0;
	});

	// Group by depth
	const byDepth: Record<number, string[]> = {};
	Object.entries(depths).forEach(([name, depth]) => {
		if (!byDepth[depth]) byDepth[depth] = [];
		byDepth[depth].push(name);
	});

	// Build nodes with positions
	const NODE_W = 200;
	const NODE_H = 80;
	const H_GAP = 40;
	const V_GAP = 60;

	const nodes: Node[] = Object.keys(states).map((name) => {
		const depth = depths[name] ?? 0;
		const siblings = byDepth[depth] || [name];
		const sibIndex = siblings.indexOf(name);
		const totalWidth = siblings.length * (NODE_W + H_GAP) - H_GAP;

		return {
			id: name,
			type: 'stateNode',
			position: {
				x: sibIndex * (NODE_W + H_GAP) - totalWidth / 2,
				y: depth * (NODE_H + V_GAP),
			},
			data: {
				label: name,
				stateType: states[name].Type || 'Pass',
				resource: states[name].Resource,
			},
		};
	});

	// Build edges
	const edges: Edge[] = [];
	const addEdge = (source: string, target: string, label?: string) => {
		edges.push({
			id: `${source}→${target}${label ? `-${label}` : ''}`,
			source,
			target,
			label,
			animated: false,
			style: { stroke: '#94a3b8' },
			labelStyle: { fontSize: 10, fill: '#6b7280' },
			labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 },
		});
	};

	Object.entries(states).forEach(([name, state]: [string, ASLState]) => {
		if (state.Next) addEdge(name, state.Next);
		if (state.Choices) {
			state.Choices.forEach((choice: ASLChoice, i: number) => {
				if (choice.Next) addEdge(name, choice.Next, `condition ${i + 1}`);
			});
		}
		if (state.Default) addEdge(name, state.Default, 'default');
		if (state.Catch) {
			state.Catch.forEach((c: ASLCatch) => {
				if (c.Next) addEdge(name, c.Next, `catch`);
			});
		}
	});

	return { nodes, edges };
}
