'use client';

import { Handle, type NodeProps, Position } from '@xyflow/react';
import { STATE_COLORS } from '../../types';

export function StateNode({ data }: NodeProps) {
	const d = data as { label: string; stateType: string; resource?: string };
	const colors = STATE_COLORS[d.stateType] ?? STATE_COLORS.Pass;

	return (
		<div style={{ background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: 8, padding: '8px 14px', minWidth: 160, maxWidth: 220, textAlign: 'center' }}>
			<Handle type='target' position={Position.Top} style={{ background: colors.border }} />
			<div style={{ fontSize: 10, color: colors.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{d.stateType}</div>
			<div style={{ fontSize: 13, fontWeight: 700, color: '#111827', wordBreak: 'break-word' }}>{d.label}</div>
			{d.resource && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2, wordBreak: 'break-all' }}>{d.resource.split(':').pop()}</div>}
			<Handle type='source' position={Position.Bottom} style={{ background: colors.border }} />
		</div>
	);
}
