'use client';

import { useEmailService } from '@/components/providers/email-service-provider';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { emailServiceAPI } from '@/lib/email-service-api';
import { EMAIL_QUICK_LINKS, EmailQuickLink } from '@/types/email-service';
import { BarChart3, FileText, Mail, Send, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const iconMap = {
	Mail,
	FileText,
	Users,
	Send,
	BarChart3,
	Settings,
};

export default function EmailsOverviewPage() {
	const { t } = useLanguage();
	const { environmentConfig } = useEmailService();
	const [stats, setStats] = useState({
		campaigns: 0,
		templates: 0,
		audiences: 0,
		senders: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const loadStats = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const [campaignsRes, templatesRes, audiencesRes, sendersRes] = await Promise.allSettled([emailServiceAPI.countCampaigns(environmentConfig), emailServiceAPI.listTemplates(environmentConfig, { limit: 1 }), emailServiceAPI.listAudiences(environmentConfig, { limit: 1 }), emailServiceAPI.listSenders(environmentConfig, { limit: 1 })]);

			setStats({
				campaigns: campaignsRes.status === 'fulfilled' ? campaignsRes.value.count : 0,
				templates: templatesRes.status === 'fulfilled' ? templatesRes.value.results?.length || templatesRes.value.Items?.length || templatesRes.value.items?.length || 0 : 0,
				audiences: audiencesRes.status === 'fulfilled' ? audiencesRes.value.results?.length || audiencesRes.value.Items?.length || audiencesRes.value.items?.length || 0 : 0,
				senders: sendersRes.status === 'fulfilled' ? sendersRes.value.results?.length || sendersRes.value.Items?.length || sendersRes.value.items?.length || 0 : 0,
			});
		} catch (err) {
			console.error('Failed to load stats:', err);
			setError(err instanceof Error ? err.message : 'Failed to load stats');
		} finally {
			setLoading(false);
		}
	}, [environmentConfig]);

	useEffect(() => {
		loadStats();
	}, [loadStats]);

	// Merge stats with quick links
	const quickLinksWithStats: EmailQuickLink[] = EMAIL_QUICK_LINKS.map((link) => {
		let count: number | null = null;
		if (link.title === 'Campaigns') count = stats.campaigns;
		if (link.title === 'Templates') count = stats.templates;
		if (link.title === 'Audiences') count = stats.audiences;
		if (link.title === 'Senders') count = stats.senders;
		return { ...link, count };
	});

	return (
		<div className='flex flex-col h-screen'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 flex-shrink-0'>
				<SidebarTrigger />
				<div className='flex-1'>
					<h1 className='text-xl font-semibold'>{t.navigation.emails}</h1>
					<p className='text-xs text-muted-foreground'>Environment: {environmentConfig.displayName}</p>
				</div>
				{error && (
					<Button variant='outline' size='sm' onClick={loadStats}>
						<BarChart3 className='mr-2 h-4 w-4' />
						Retry
					</Button>
				)}
			</header>

			<div className='flex-1 p-6 overflow-y-auto'>
				<div className='mx-auto max-w-6xl space-y-8'>
					{/* Header */}
					<div>
						<h2 className='text-3xl font-bold mb-2'>Email Service Management</h2>
						<p className='text-muted-foreground'>Manage campaigns, templates, audiences, and monitor email delivery</p>
					</div>

					{error && (
						<div className='border border-destructive rounded-lg p-4 bg-destructive/10'>
							<p className='text-sm text-destructive'>{error}</p>
						</div>
					)}

					{/* Quick Links Grid */}
					<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
						{quickLinksWithStats.map((link) => {
							const Icon = iconMap[link.icon as keyof typeof iconMap];
							return (
								<Link key={link.href} href={link.href}>
									<div className={`border rounded-lg p-6 transition-all hover:shadow-md cursor-pointer h-full ${link.color}`}>
										<div className='flex items-start justify-between mb-3'>
											<Icon className='h-8 w-8' />
											{link.count !== null && <span className='text-2xl font-bold'>{loading ? '...' : link.count}</span>}
										</div>
										<h3 className='font-semibold text-lg mb-1'>{link.title}</h3>
										<p className='text-sm opacity-80'>{link.description}</p>
									</div>
								</Link>
							);
						})}
					</div>

					{/* Quick Actions */}
					<div className='border rounded-lg p-6 bg-card'>
						<h3 className='font-semibold text-lg mb-4'>Quick Actions</h3>
						<div className='flex flex-wrap gap-3'>
							<Button asChild>
								<Link href='/emails/campaigns'>
									<Mail className='mr-2 h-4 w-4' />
									New Campaign
								</Link>
							</Button>
							<Button variant='outline' asChild>
								<Link href='/emails/templates'>
									<FileText className='mr-2 h-4 w-4' />
									New Template
								</Link>
							</Button>
							<Button variant='outline' asChild>
								<Link href='/emails/audiences'>
									<Users className='mr-2 h-4 w-4' />
									New Audience
								</Link>
							</Button>
							<Button variant='outline' asChild>
								<Link href='/emails/status'>
									<BarChart3 className='mr-2 h-4 w-4' />
									View Status
								</Link>
							</Button>
						</div>
					</div>

					{/* Info Box */}
					<div className='border rounded-lg p-6 bg-muted/50'>
						<h3 className='font-semibold mb-2'>AWS SES Email Service</h3>
						<p className='text-sm text-muted-foreground'>This dashboard provides a comprehensive interface for managing your AWS SES-based email campaigns. Create campaigns, manage templates and audiences, configure sender identities, and monitor delivery metrics all in one place.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
