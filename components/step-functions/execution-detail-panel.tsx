'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Loader2, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Execution {
	name: string;
	executionArn: string;
	status: string;
	startDate: string;
	stopDate?: string;
}

interface Counts {
	RUNNING: number;
	SUCCEEDED: number;
	FAILED: number;
	TIMED_OUT: number;
	ABORTED: number;
}

interface StatMachine {
	name: string;
	stateMachineArn: string;
}

interface ExecutionDetailPanelProps {
	sm: StatMachine;
	region: string;
	profile: string;
	onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(startDate: string, stopDate?: string): string {
	const start = new Date(startDate).getTime();
	const end = stopDate ? new Date(stopDate).getTime() : Date.now();
	const ms = end - start;
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	const mins = Math.floor(ms / 60000);
	const secs = Math.floor((ms % 60000) / 1000);
	return `${mins}m ${secs}s`;
}

function formatDate(date: string): string {
	return new Date(date).toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}

const STATUS_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
	SUCCEEDED: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700 border-green-300', label: 'Succeeded' },
	FAILED: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-700 border-red-300', label: 'Failed' },
	RUNNING: { dot: 'bg-blue-500 animate-pulse', badge: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Running' },
	TIMED_OUT: { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700 border-orange-300', label: 'Timed Out' },
	ABORTED: { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 border-gray-300', label: 'Aborted' },
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color, onClick, isActive }: { label: string; value: number; color: string; onClick?: () => void; isActive?: boolean }) {
	return (
		<div onClick={onClick} className={`rounded-lg border p-4 text-center transition-all ${color} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${isActive ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
			<p className='text-2xl font-bold'>{value}</p>
			<p className='text-xs font-medium mt-0.5 opacity-80'>{label}</p>
			{isActive && <p className='text-xs mt-1 opacity-60'>↑ filtered</p>}
		</div>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ExecutionDetailPanel({ sm, region, profile, onClose }: ExecutionDetailPanelProps) {
	const [executions, setExecutions] = useState<Execution[]>([]);
	const [counts, setCounts] = useState<Counts | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [limit, setLimit] = useState<number>(10);
	const [statusFilter, setStatusFilter] = useState<string | null>(null);

	const consoleUrl = `https://${region}.console.aws.amazon.com/states/home?region=${region}#/statemachines/view/${encodeURIComponent(sm.stateMachineArn)}`;

	const load = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const res = await fetch('/api/step-function/executions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ arn: sm.stateMachineArn, profile, region, limit: statusFilter ? 1000 : limit }),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.details || err.error);
			}
			const data = await res.json();
			setExecutions(data.executions ?? []);
			setCounts(data.counts ?? null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load executions');
		} finally {
			setLoading(false);
		}
	}, [sm.stateMachineArn, profile, region, limit, statusFilter]);

	useEffect(() => {
		load();
	}, [load]);

	const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
	const filteredExecutions = statusFilter ? executions.filter((ex) => ex.status === statusFilter) : executions;

	return (
		<div className='flex flex-col h-full bg-background'>
			{/* Header */}
			<div className='flex items-center justify-between p-4 border-b flex-shrink-0'>
				<div className='flex-1 min-w-0'>
					<h2 className='font-semibold truncate'>{sm.name}</h2>
					<p className='text-xs text-muted-foreground font-mono truncate'>{sm.stateMachineArn}</p>
				</div>
				<div className='flex items-center gap-1 ml-2'>
					<Button variant='outline' size='sm' onClick={() => window.open(consoleUrl, '_blank', 'noopener,noreferrer')}>
						<ExternalLink className='h-3.5 w-3.5' />
					</Button>
					<Button variant='ghost' size='sm' onClick={load} disabled={loading}>
						<RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
					</Button>
					<Button variant='ghost' size='sm' onClick={onClose}>
						<X className='h-4 w-4' />
					</Button>
				</div>
			</div>

			{loading && !counts && (
				<div className='flex items-center justify-center flex-1'>
					<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
				</div>
			)}

			{error && (
				<div className='flex flex-col items-center justify-center flex-1 gap-3'>
					<p className='text-sm text-destructive'>{error}</p>
					<Button size='sm' variant='outline' onClick={load}>
						Retry
					</Button>
				</div>
			)}

			{!error && counts && (
				<div className='flex-1 overflow-y-auto p-4 space-y-5'>
					{/* Stats */}
					<div className='grid grid-cols-5 gap-2'>
						<StatCard label='Total' value={total} color='bg-muted/50 border-border' onClick={() => setStatusFilter(null)} isActive={statusFilter === null} />
						<StatCard label='Running' value={counts.RUNNING} color='bg-blue-50 border-blue-200 text-blue-800' onClick={() => setStatusFilter(statusFilter === 'RUNNING' ? null : 'RUNNING')} isActive={statusFilter === 'RUNNING'} />
						<StatCard label='Succeeded' value={counts.SUCCEEDED} color='bg-green-50 border-green-200 text-green-800' onClick={() => setStatusFilter(statusFilter === 'SUCCEEDED' ? null : 'SUCCEEDED')} isActive={statusFilter === 'SUCCEEDED'} />
						<StatCard label='Failed' value={counts.FAILED} color='bg-red-50 border-red-200 text-red-800' onClick={() => setStatusFilter(statusFilter === 'FAILED' ? null : 'FAILED')} isActive={statusFilter === 'FAILED'} />
						<StatCard label='Timed Out' value={counts.TIMED_OUT} color='bg-orange-50 border-orange-200 text-orange-800' onClick={() => setStatusFilter(statusFilter === 'TIMED_OUT' ? null : 'TIMED_OUT')} isActive={statusFilter === 'TIMED_OUT'} />
					</div>

					{/* Recent executions */}
					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<p className='text-sm font-semibold'>Recent Executions</p>
								{statusFilter && (
									<button onClick={() => setStatusFilter(null)} className='text-xs text-muted-foreground hover:text-foreground underline'>
										clear filter
									</button>
								)}
							</div>
							{!statusFilter && (
								<Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
									<SelectTrigger className='w-24 h-7 text-xs'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='10'>Last 10</SelectItem>
										<SelectItem value='20'>Last 20</SelectItem>
										<SelectItem value='50'>Last 50</SelectItem>
									</SelectContent>
								</Select>
							)}
						</div>

						{loading && (
							<div className='flex items-center justify-center py-8'>
								<Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
							</div>
						)}

						{!loading && filteredExecutions.length === 0 && <p className='text-sm text-muted-foreground text-center py-8'>{statusFilter ? `No ${statusFilter.toLowerCase()} executions` : 'No executions found'}</p>}

						{!loading && filteredExecutions.length > 0 && (
							<div className='space-y-2'>
								{filteredExecutions.map((ex) => {
									const style = STATUS_STYLES[ex.status] ?? STATUS_STYLES.ABORTED;
									const execConsoleUrl = `https://${region}.console.aws.amazon.com/states/home?region=${region}#/executions/details/${encodeURIComponent(ex.executionArn)}`;
									return (
										<div key={ex.executionArn} className='border rounded-lg p-3 space-y-1.5 hover:border-primary transition-colors'>
											<div className='flex items-center justify-between gap-2'>
												<div className='flex items-center gap-2 min-w-0'>
													<span className={`h-2 w-2 rounded-full flex-shrink-0 ${style.dot}`} />
													<span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${style.badge}`}>{style.label}</span>
													<span className='text-xs text-muted-foreground font-mono truncate'>{ex.name}</span>
												</div>
												<Button variant='ghost' size='sm' className='h-6 w-6 p-0 flex-shrink-0' onClick={() => window.open(execConsoleUrl, '_blank', 'noopener,noreferrer')}>
													<ExternalLink className='h-3 w-3' />
												</Button>
											</div>
											<div className='grid grid-cols-3 gap-2 text-xs text-muted-foreground pl-4'>
												<div>
													<span className='font-medium block'>Started</span>
													{formatDate(ex.startDate)}
												</div>
												<div>
													<span className='font-medium block'>Ended</span>
													{ex.stopDate ? formatDate(ex.stopDate) : <span className='italic'>still running</span>}
												</div>
												<div>
													<span className='font-medium block'>Duration</span>
													{formatDuration(ex.startDate, ex.stopDate)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
