'use client';

import { STATE_COLORS } from '@/types/flow-launcher';
import { Handle, type NodeProps, Position } from '@xyflow/react';

export function StateNode({ data }: NodeProps) {
	const d = data as { label: string; resource?: string; stateType: string };
	const colors = STATE_COLORS[d.stateType] ?? STATE_COLORS['Pass'];

	return (
		<div style={{ background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: 8, maxWidth: 220, minWidth: 160, padding: '8px 14px', textAlign: 'center' }}>
			<Handle type='target' position={Position.Top} style={{ background: colors.border }} />
			<div style={{ color: colors.text, fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 2, textTransform: 'uppercase' }}>{d.stateType}</div>
			<div style={{ color: '#111827', fontSize: 13, fontWeight: 700, wordBreak: 'break-word' }}>{d.label}</div>
			{d.resource && <div style={{ color: '#6b7280', fontSize: 10, marginTop: 2, wordBreak: 'break-all' }}>{d.resource.split(':').pop()}</div>}
			<Handle type='source' position={Position.Bottom} style={{ background: colors.border }} />
		</div>
	);
}
