'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type HookEntry = {
	type: string;
	command?: string;
};

type HookGroup = {
	matcher?: string;
	hooks: HookEntry[];
};

type Permissions = {
	allow?: string[];
	deny?: string[];
};

type ClaudeSettings = {
	hooks?: Record<string, HookGroup[]>;
	permissions?: Permissions;
	env?: Record<string, string>;
};

type SettingsData = {
	global: ClaudeSettings | null;
	project: ClaudeSettings | null;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<h3 className='mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
				{title}
			</h3>
			{children}
		</div>
	);
}

function EmptyRow({ label }: { label: string }) {
	return <p className='text-sm text-muted-foreground'>{label}</p>;
}

function HooksView({ hooks }: { hooks: Record<string, HookGroup[]> }) {
	const entries = Object.entries(hooks);
	if (entries.length === 0) return <EmptyRow label='No hooks configured' />;

	return (
		<div className='space-y-3'>
			{entries.map(([event, groups]) => (
				<div key={event}>
					<p className='mb-1.5 text-xs font-medium text-foreground'>{event}</p>
					<div className='space-y-1.5'>
						{groups.map((group, i) => (
							<div key={i} className='rounded-md border bg-muted/40 px-3 py-2'>
								{group.matcher && (
									<p className='mb-1 text-xs text-muted-foreground'>
										matcher: <span className='font-mono font-medium text-foreground'>{group.matcher}</span>
									</p>
								)}
								{group.hooks.map((h, j) => (
									<p key={j} className='break-all font-mono text-xs'>
										{h.command ?? h.type}
									</p>
								))}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function PermissionsView({ permissions }: { permissions: Permissions }) {
	const allow = permissions.allow ?? [];
	const deny = permissions.deny ?? [];

	if (allow.length === 0 && deny.length === 0) {
		return <EmptyRow label='No permissions configured' />;
	}

	return (
		<div className='space-y-3'>
			{allow.length > 0 && (
				<div>
					<p className='mb-1.5 text-xs font-medium text-green-600 dark:text-green-400'>Allow</p>
					<div className='space-y-1'>
						{allow.map((rule, i) => (
							<p key={i} className='rounded-md border border-green-200 bg-green-50 px-2 py-1 font-mono text-xs dark:border-green-900 dark:bg-green-950/20'>
								{rule}
							</p>
						))}
					</div>
				</div>
			)}
			{deny.length > 0 && (
				<div>
					<p className='mb-1.5 text-xs font-medium text-red-600 dark:text-red-400'>Deny</p>
					<div className='space-y-1'>
						{deny.map((rule, i) => (
							<p key={i} className='rounded-md border border-red-200 bg-red-50 px-2 py-1 font-mono text-xs dark:border-red-900 dark:bg-red-950/20'>
								{rule}
							</p>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function SettingsPanel({ settings, label }: { settings: ClaudeSettings | null; label: string }) {
	if (!settings) {
		return (
			<div className='rounded-lg border border-dashed p-6 text-center'>
				<p className='text-sm text-muted-foreground'>No {label} settings found</p>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<Section title='Hooks'>
				{settings.hooks ? <HooksView hooks={settings.hooks} /> : <EmptyRow label='No hooks configured' />}
			</Section>

			<Section title='Permissions'>
				{settings.permissions ? (
					<PermissionsView permissions={settings.permissions} />
				) : (
					<EmptyRow label='No permissions configured' />
				)}
			</Section>

			{settings.env && Object.keys(settings.env).length > 0 && (
				<Section title='Environment Variables'>
					<div className='space-y-1'>
						{Object.entries(settings.env).map(([key, value]) => (
							<div key={key} className='flex gap-2 rounded-md border px-2 py-1 font-mono text-xs'>
								<span className='font-medium'>{key}</span>
								<span className='text-muted-foreground'>=</span>
								<span>{value}</span>
							</div>
						))}
					</div>
				</Section>
			)}
		</div>
	);
}

export function SettingsInspector() {
	const [data, setData] = useState<SettingsData | null>(null);

	useEffect(() => {
		fetch('/api/claude-code/settings')
			.then((r) => r.json())
			.then(setData);
	}, []);

	if (!data) {
		return (
			<div className='space-y-4'>
				<Skeleton className='h-4 w-32' />
				<Skeleton className='h-20 w-full' />
				<Skeleton className='h-4 w-32' />
				<Skeleton className='h-20 w-full' />
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
			<div>
				<h2 className='mb-4 font-medium'>Global settings</h2>
				<SettingsPanel settings={data.global} label='global' />
			</div>
			<div>
				<h2 className='mb-4 font-medium'>Project settings</h2>
				<SettingsPanel settings={data.project} label='project' />
			</div>
		</div>
	);
}
