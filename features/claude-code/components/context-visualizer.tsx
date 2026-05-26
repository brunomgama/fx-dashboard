'use client';

import { useEffect, useState } from 'react';

type Stats = {
	totalMemories: number;
	memoryByType: Record<string, number>;
	hooks: number;
	permissions: number;
	projects: number;
	conversations: number;
};

const TOKEN_BUDGET = 200_000;

const BUDGET_SEGMENTS = [
	{ label: 'System prompt', tokens: 7100, color: 'bg-blue-500' },
	{ label: 'System tools', tokens: 9400, color: 'bg-indigo-500' },
	{ label: 'Deferred tools', tokens: 11500, color: 'bg-violet-500' },
	{ label: 'Memory files', tokens: 592, color: 'bg-orange-400' },
	{ label: 'Skills', tokens: 721, color: 'bg-yellow-400' },
	{ label: 'Autocompact buffer', tokens: 33000, color: 'bg-slate-400' },
];

const USED_TOKENS = BUDGET_SEGMENTS.reduce((s, b) => s + b.tokens, 0);
const FREE_TOKENS = TOKEN_BUDGET - USED_TOKENS;

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
	return (
		<div className='rounded-lg border bg-card p-4'>
			<p className='text-sm text-muted-foreground'>{label}</p>
			<p className='mt-1 text-2xl font-semibold tabular-nums'>{value}</p>
			{sub && <p className='mt-0.5 text-xs text-muted-foreground'>{sub}</p>}
		</div>
	);
}

function fmt(n: number) {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
	return String(n);
}

export function ContextVisualizer() {
	const [stats, setStats] = useState<Stats | null>(null);

	useEffect(() => {
		fetch('/api/claude-code/stats')
			.then((r) => r.json())
			.then(setStats);
	}, []);

	return (
		<div className='space-y-6'>
			<div>
				<h2 className='mb-1 text-sm font-medium text-muted-foreground'>Model</h2>
				<div className='flex items-center gap-3'>
					<span className='rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'>
						claude-sonnet-4-6
					</span>
					<span className='text-sm text-muted-foreground'>200k context window</span>
				</div>
			</div>

			<div>
				<div className='mb-2 flex items-center justify-between'>
					<h2 className='text-sm font-medium text-muted-foreground'>Context budget</h2>
					<span className='text-xs text-muted-foreground'>
						~{fmt(USED_TOKENS)} used · {fmt(FREE_TOKENS)} free
					</span>
				</div>
				<div className='flex h-4 w-full overflow-hidden rounded-full bg-muted'>
					{BUDGET_SEGMENTS.map((seg) => (
						<div
							key={seg.label}
							className={`${seg.color} transition-all`}
							style={{ width: `${(seg.tokens / TOKEN_BUDGET) * 100}%` }}
							title={`${seg.label}: ${fmt(seg.tokens)} tokens`}
						/>
					))}
					<div
						className='bg-muted-foreground/10'
						style={{ width: `${(FREE_TOKENS / TOKEN_BUDGET) * 100}%` }}
					/>
				</div>
				<div className='mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3'>
					{BUDGET_SEGMENTS.map((seg) => (
						<div key={seg.label} className='flex items-center gap-2 text-xs'>
							<span className={`h-2 w-2 shrink-0 rounded-full ${seg.color}`} />
							<span className='text-muted-foreground'>{seg.label}</span>
							<span className='ml-auto font-medium tabular-nums'>{fmt(seg.tokens)}</span>
						</div>
					))}
					<div className='flex items-center gap-2 text-xs'>
						<span className='h-2 w-2 shrink-0 rounded-full bg-muted-foreground/20' />
						<span className='text-muted-foreground'>Free</span>
						<span className='ml-auto font-medium tabular-nums'>{fmt(FREE_TOKENS)}</span>
					</div>
				</div>
			</div>

			<div>
				<h2 className='mb-3 text-sm font-medium text-muted-foreground'>Project stats</h2>
				<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
					<StatCard
						label='Memory files'
						value={stats?.totalMemories ?? '—'}
						sub='this project'
					/>
					<StatCard
						label='Hooks'
						value={stats?.hooks ?? '—'}
						sub='global settings'
					/>
					<StatCard
						label='Permissions'
						value={stats?.permissions ?? '—'}
						sub='project settings'
					/>
					<StatCard
						label='Conversations'
						value={stats?.conversations ?? '—'}
						sub='session files'
					/>
					<StatCard
						label='Claude projects'
						value={stats?.projects ?? '—'}
						sub='on this machine'
					/>
				</div>
			</div>

			{stats && Object.keys(stats.memoryByType).length > 0 && (
				<div>
					<h2 className='mb-3 text-sm font-medium text-muted-foreground'>Memory by type</h2>
					<div className='flex flex-wrap gap-2'>
						{Object.entries(stats.memoryByType).map(([type, count]) => (
							<div key={type} className='rounded-md border px-3 py-1.5 text-sm'>
								<span className='font-medium'>{count}</span>
								<span className='ml-1.5 text-muted-foreground'>{type}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
