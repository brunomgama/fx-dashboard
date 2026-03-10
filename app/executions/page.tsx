'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { useLanguage } from '@/components/providers/language-provider';
import { ExecutionDetailPanel } from '@/components/step-functions/execution-detail-panel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ExternalLink, Loader2, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StateMachine {
	name: string;
	stateMachineArn: string;
	type: string;
	creationDate: string;
}

interface ParsedName {
	project: string;
	name: string;
	env: string;
	company: string;
	raw: string;
}

// ─── Name parser ──────────────────────────────────────────────────────────────
// Pattern: {project}-{...name...}-{env}-{company}
// env:     dev | staging | prod
// company: jaimy | mri | asr
// project: launcher | email | smart-events (etc.)

const KNOWN_ENVS = ['dev', 'staging', 'prod'] as const;
const KNOWN_COMPANIES = ['jaimy', 'mri', 'asr'] as const;
const KNOWN_PROJECTS = ['launcher', 'email', 'smart-events'] as const;

type Env = (typeof KNOWN_ENVS)[number];
type Company = (typeof KNOWN_COMPANIES)[number];
type Project = (typeof KNOWN_PROJECTS)[number];

function parseName(name: string): ParsedName {
	const parts = name.split('-');

	// Find company (last known company segment from the right)
	let companyIdx = -1;
	for (let i = parts.length - 1; i >= 0; i--) {
		if ((KNOWN_COMPANIES as readonly string[]).includes(parts[i])) {
			companyIdx = i;
			break;
		}
	}

	// Find env (just before company)
	let envIdx = -1;
	for (let i = (companyIdx === -1 ? parts.length : companyIdx) - 1; i >= 0; i--) {
		if ((KNOWN_ENVS as readonly string[]).includes(parts[i])) {
			envIdx = i;
			break;
		}
	}

	const company = companyIdx !== -1 ? parts[companyIdx] : 'unknown';
	const env = envIdx !== -1 ? parts[envIdx] : 'unknown';

	// Project is the first segment(s) before the middle name
	// Middle name is everything between project and env
	const middleStart = 1;
	const middleEnd = envIdx !== -1 ? envIdx : parts.length;
	const project = parts[0] ?? 'unknown';
	const middle = parts.slice(middleStart, middleEnd).join('-');

	return { project, name: middle || name, env, company, raw: name };
}

// ─── Filter chips ─────────────────────────────────────────────────────────────

const ENV_COLORS: Record<string, string> = {
	prod: 'bg-red-100 text-red-700 border-red-300',
	staging: 'bg-yellow-100 text-yellow-700 border-yellow-300',
	dev: 'bg-green-100 text-green-700 border-green-300',
	unknown: 'bg-gray-100 text-gray-600 border-gray-300',
};

const PROJECT_COLORS: Record<string, string> = {
	launcher: 'bg-blue-100 text-blue-700 border-blue-300',
	email: 'bg-purple-100 text-purple-700 border-purple-300',
	'smart-events': 'bg-cyan-100 text-cyan-700 border-cyan-300',
	unknown: 'bg-gray-100 text-gray-600 border-gray-300',
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function StateMachineCard({ sm, parsed, region, isSelected, onSelect }: { sm: StateMachine; parsed: ParsedName; region: string; isSelected: boolean; onSelect: () => void }) {
	const consoleUrl = `https://${region}.console.aws.amazon.com/states/home?region=${region}#/statemachines/view/${encodeURIComponent(sm.stateMachineArn)}`;

	return (
		<div onClick={onSelect} className={`border rounded-lg p-4 space-y-3 cursor-pointer hover:border-primary transition-colors ${isSelected ? 'border-primary bg-primary/5' : ''}`}>
			<div className='flex items-start justify-between gap-2'>
				<div className='flex-1 min-w-0'>
					<h3 className='font-semibold truncate'>{parsed.name || sm.name}</h3>
					<p className='text-xs text-muted-foreground font-mono truncate mt-0.5'>{sm.name}</p>
				</div>
				<Button size='sm' variant='outline' className='flex-shrink-0' onClick={() => window.open(consoleUrl, '_blank', 'noopener,noreferrer')} title='Open in AWS Console'>
					<ExternalLink className='h-3.5 w-3.5' />
				</Button>
			</div>

			<div className='flex flex-wrap gap-1.5'>
				<span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PROJECT_COLORS[parsed.project] ?? PROJECT_COLORS.unknown}`}>{parsed.project}</span>
				<span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ENV_COLORS[parsed.env] ?? ENV_COLORS.unknown}`}>{parsed.env}</span>
				<span className='text-xs px-2 py-0.5 rounded-full border font-medium bg-muted text-muted-foreground'>{parsed.company}</span>
				<span className='text-xs px-2 py-0.5 rounded-full border font-medium bg-muted/50 text-muted-foreground'>{sm.type}</span>
			</div>

			<p className='text-xs text-muted-foreground font-mono truncate'>{sm.stateMachineArn}</p>

			<p className='text-xs text-muted-foreground'>Created: {new Date(sm.creationDate).toLocaleDateString()}</p>
		</div>
	);
}

// ─── Filter group ─────────────────────────────────────────────────────────────

function FilterGroup<T extends string>({ label, options, selected, onChange }: { label: string; options: readonly T[]; selected: Set<T>; onChange: (val: T) => void }) {
	return (
		<div className='space-y-2'>
			<p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide'>{label}</p>
			<div className='flex flex-wrap gap-2'>
				{options.map((opt) => (
					<label key={opt} className='flex items-center gap-1.5 cursor-pointer select-none'>
						<Checkbox checked={selected.has(opt)} onCheckedChange={() => onChange(opt)} />
						<span className='text-sm'>{opt}</span>
					</label>
				))}
			</div>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExecutionsPage() {
	const { t } = useLanguage();
	const { environmentConfig } = useFlowLauncher();

	const [stateMachines, setStateMachines] = useState<StateMachine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const [selectedProjects, setSelectedProjects] = useState<Set<Project>>(new Set());
	const [selectedEnvs, setSelectedEnvs] = useState<Set<Env>>(new Set());
	const [selectedCompanies, setSelectedCompanies] = useState<Set<Company>>(new Set());
	const [selectedSM, setSelectedSM] = useState<StateMachine | null>(null);
	const [panelWidth, setPanelWidth] = useState(66); // percentage
	const containerRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);

	const handleDragStart = (e: React.MouseEvent) => {
		e.preventDefault();
		isDragging.current = true;
		document.body.style.cursor = 'col-resize';
		document.body.style.userSelect = 'none';

		const onMove = (moveEvent: MouseEvent) => {
			if (!isDragging.current || !containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			// panelWidth is measured from the right edge
			const fromRight = rect.right - moveEvent.clientX;
			const pct = (fromRight / rect.width) * 100;
			setPanelWidth(Math.min(85, Math.max(30, pct)));
		};

		const onUp = () => {
			isDragging.current = false;
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		};

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	};

	const loadStateMachines = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const res = await fetch('/api/step-function/list', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					profile: environmentConfig.awsProfile,
					region: environmentConfig.region,
				}),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.details || err.error);
			}
			const data = await res.json();
			setStateMachines(data.stateMachines ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load state machines');
		} finally {
			setLoading(false);
		}
	}, [environmentConfig.awsProfile, environmentConfig.region]);

	useEffect(() => {
		loadStateMachines();
	}, [loadStateMachines]);

	const parsed = useMemo(() => stateMachines.map((sm) => parseName(sm.name)), [stateMachines]);

	const toggle = <T extends string>(set: Set<T>, val: T): Set<T> => {
		const next = new Set(set);
		next.has(val) ? next.delete(val) : next.add(val);
		return next;
	};

	const filtered = useMemo(() => {
		return stateMachines.filter((sm, i) => {
			const p = parsed[i];
			const q = searchQuery.toLowerCase();
			if (q && !sm.name.toLowerCase().includes(q)) return false;
			if (selectedProjects.size > 0 && !selectedProjects.has(p.project as Project)) return false;
			if (selectedEnvs.size > 0 && !selectedEnvs.has(p.env as Env)) return false;
			if (selectedCompanies.size > 0 && !selectedCompanies.has(p.company as Company)) return false;
			return true;
		});
	}, [stateMachines, parsed, searchQuery, selectedProjects, selectedEnvs, selectedCompanies]);

	const filteredParsed = useMemo(() => filtered.map((sm) => parseName(sm.name)), [filtered]);

	const hasFilters = selectedProjects.size > 0 || selectedEnvs.size > 0 || selectedCompanies.size > 0 || searchQuery;

	return (
		<div className='flex flex-col h-screen'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 flex-shrink-0'>
				<SidebarTrigger />
				<div className='flex-1'>
					<h1 className='text-xl font-semibold'>Executions</h1>
					<p className='text-xs text-muted-foreground'>Environment: {environmentConfig.displayName}</p>
				</div>
			</header>

			<div ref={containerRef} className='flex-1 flex overflow-hidden min-h-0'>
				{/* Sidebar filters */}
				<aside className='w-56 flex-shrink-0 border-r p-4 space-y-5 overflow-y-auto'>
					<FilterGroup label='Project' options={KNOWN_PROJECTS} selected={selectedProjects} onChange={(v) => setSelectedProjects(toggle(selectedProjects, v))} />
					<FilterGroup label='Environment' options={KNOWN_ENVS} selected={selectedEnvs} onChange={(v) => setSelectedEnvs(toggle(selectedEnvs, v))} />
					<FilterGroup label='Company' options={KNOWN_COMPANIES} selected={selectedCompanies} onChange={(v) => setSelectedCompanies(toggle(selectedCompanies, v))} />
					{hasFilters && (
						<Button
							variant='ghost'
							size='sm'
							className='w-full text-muted-foreground'
							onClick={() => {
								setSelectedProjects(new Set());
								setSelectedEnvs(new Set());
								setSelectedCompanies(new Set());
								setSearchQuery('');
							}}>
							Clear filters
						</Button>
					)}
				</aside>

				{/* Main content */}
				<div className='flex flex-col min-h-0 p-6 overflow-hidden' style={{ width: selectedSM ? `${100 - panelWidth}%` : '100%' }}>
					<div className='flex items-center gap-4 pb-4 flex-shrink-0'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input placeholder='Search state machines...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
						</div>
						<span className='text-sm text-muted-foreground whitespace-nowrap'>
							{filtered.length} / {stateMachines.length}
						</span>
					</div>

					{loading && (
						<div className='flex items-center justify-center flex-1'>
							<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
						</div>
					)}

					{error && (
						<div className='flex flex-col items-center justify-center flex-1 gap-4'>
							<p className='text-destructive'>{error}</p>
							<Button onClick={loadStateMachines}>Retry</Button>
						</div>
					)}

					{!loading && !error && (
						<div className='overflow-y-auto flex-1 min-h-0'>
							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-4'>
								{filtered.map((sm, i) => (
									<StateMachineCard key={sm.stateMachineArn} sm={sm} parsed={filteredParsed[i]} region={environmentConfig.region} isSelected={selectedSM?.stateMachineArn === sm.stateMachineArn} onSelect={() => setSelectedSM(sm)} />
								))}
							</div>
							{filtered.length === 0 && <div className='text-center py-16 text-muted-foreground'>No state machines match your filters</div>}
						</div>
					)}
				</div>

				{selectedSM && (
					<>
						{/* Drag handle */}
						<div onMouseDown={handleDragStart} className='w-1 flex-shrink-0 cursor-col-resize bg-border hover:bg-primary/40 transition-colors relative group' title='Drag to resize'>
							<div className='absolute inset-y-0 -left-1 -right-1' />
						</div>
						{/* Detail panel */}
						<div className='min-h-0 overflow-hidden flex flex-col flex-shrink-0' style={{ width: `${panelWidth}%` }}>
							<ExecutionDetailPanel sm={selectedSM} region={environmentConfig.region} profile={environmentConfig.awsProfile} onClose={() => setSelectedSM(null)} />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
