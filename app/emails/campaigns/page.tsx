'use client';

import { useEmailService } from '@/components/providers/email-service-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { emailServiceAPI } from '@/lib/email-service-api';
import { Campaign, CampaignStatus, STATUS_COLORS } from '@/types/email-service';
import { Copy, Loader2, Mail, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function CampaignsPage() {
	const { environmentConfig } = useEmailService();
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

	const loadCampaigns = useCallback(async () => {
		setLoading(true);
		setError('');
		try {
			const response = await emailServiceAPI.listCampaigns(environmentConfig, { limit: 100 });
			const campaignData = response.results || response.Items || response.items || [];
			setCampaigns(campaignData);
		} catch (err) {
			console.error('Error loading campaigns:', err);
			setError(err instanceof Error ? err.message : 'Failed to load campaigns');
		} finally {
			setLoading(false);
		}
	}, [environmentConfig]);

	useEffect(() => {
		loadCampaigns();
	}, [loadCampaigns]);

	const handleDelete = async (campaign: Campaign) => {
		if (!confirm(`Are you sure you want to delete campaign "${campaign.name}"?`)) return;

		try {
			await emailServiceAPI.deleteCampaign(environmentConfig, campaign.id);
			await loadCampaigns();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete campaign');
		}
	};

	const handleDuplicate = async (campaign: Campaign) => {
		try {
			await fetch(`${environmentConfig.apiUrl}/campaigns/${campaign.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': environmentConfig.apiKey,
				},
				body: JSON.stringify({ user: 'dashboard-user' }),
			});
			await loadCampaigns();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to duplicate campaign');
		}
	};

	const filteredCampaigns = campaigns.filter((campaign) => {
		const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) || campaign.subject?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'all' || campaign.status.toLowerCase() === statusFilter.toLowerCase();
		return matchesSearch && matchesStatus;
	});

	const groupedByStatus = filteredCampaigns.reduce((acc, campaign) => {
		const status = campaign.status.toLowerCase() as CampaignStatus;
		if (!acc[status]) acc[status] = [];
		acc[status].push(campaign);
		return acc;
	}, {} as Record<CampaignStatus, Campaign[]>);

	if (loading) {
		return (
			<div className='flex flex-col h-screen'>
				<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
					<SidebarTrigger />
					<h1 className='text-xl font-semibold'>Campaigns</h1>
				</header>
				<div className='flex items-center justify-center flex-1'>
					<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex flex-col h-screen'>
				<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
					<SidebarTrigger />
					<h1 className='text-xl font-semibold'>Campaigns</h1>
				</header>
				<div className='flex flex-col items-center justify-center flex-1 gap-4'>
					<p className='text-destructive'>{error}</p>
					<Button onClick={loadCampaigns}>Retry</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-screen'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 flex-shrink-0'>
				<SidebarTrigger />
				<div className='flex-1'>
					<h1 className='text-xl font-semibold'>Campaigns</h1>
					<p className='text-xs text-muted-foreground'>Environment: {environmentConfig.displayName}</p>
				</div>
				<Button>
					<Plus className='mr-2 h-4 w-4' />
					New Campaign
				</Button>
			</header>

			<div className='flex-1 p-6 overflow-hidden'>
				<div className='h-full flex flex-col gap-4'>
					{/* Filters */}
					<div className='flex items-center gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input placeholder='Search campaigns...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10' />
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Filter by status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Statuses</SelectItem>
								<SelectItem value='draft'>Draft</SelectItem>
								<SelectItem value='planned'>Planned</SelectItem>
								<SelectItem value='sending'>Sending</SelectItem>
								<SelectItem value='sent'>Sent</SelectItem>
								<SelectItem value='archived'>Archived</SelectItem>
								<SelectItem value='incomplete'>Incomplete</SelectItem>
							</SelectContent>
						</Select>
						<span className='text-sm text-muted-foreground whitespace-nowrap'>
							{filteredCampaigns.length} / {campaigns.length}
						</span>
					</div>

					{/* Tabs View */}
					<Tabs defaultValue='all' className='flex-1 min-h-0 flex flex-col'>
						<TabsList className='grid w-full grid-cols-7'>
							<TabsTrigger value='all'>All ({filteredCampaigns.length})</TabsTrigger>
							<TabsTrigger value='draft'>Draft ({groupedByStatus.draft?.length || 0})</TabsTrigger>
							<TabsTrigger value='planned'>Planned ({groupedByStatus.planned?.length || 0})</TabsTrigger>
							<TabsTrigger value='sending'>Sending ({groupedByStatus.sending?.length || 0})</TabsTrigger>
							<TabsTrigger value='sent'>Sent ({groupedByStatus.sent?.length || 0})</TabsTrigger>
							<TabsTrigger value='archived'>Archived ({groupedByStatus.archived?.length || 0})</TabsTrigger>
							<TabsTrigger value='incomplete'>Incomplete ({groupedByStatus.incomplete?.length || 0})</TabsTrigger>
						</TabsList>

						<TabsContent value='all' className='flex-1 overflow-y-auto mt-4'>
							<CampaignGrid campaigns={filteredCampaigns} onDelete={handleDelete} onDuplicate={handleDuplicate} onSelect={setSelectedCampaign} />
						</TabsContent>

						{Object.entries(groupedByStatus).map(([status, statusCampaigns]) => (
							<TabsContent key={status} value={status} className='flex-1 overflow-y-auto mt-4'>
								<CampaignGrid campaigns={statusCampaigns} onDelete={handleDelete} onDuplicate={handleDuplicate} onSelect={setSelectedCampaign} />
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
}

function CampaignGrid({ campaigns, onDelete, onDuplicate, onSelect }: { campaigns: Campaign[]; onDelete: (campaign: Campaign) => void; onDuplicate: (campaign: Campaign) => void; onSelect: (campaign: Campaign) => void }) {
	if (campaigns.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-16 text-center'>
				<Mail className='h-16 w-16 text-muted-foreground/50 mb-4' />
				<h3 className='text-lg font-semibold mb-2'>No campaigns found</h3>
				<p className='text-sm text-muted-foreground'>Create your first campaign to get started</p>
			</div>
		);
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{campaigns.map((campaign) => (
				<div key={campaign.id} className='border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer group' onClick={() => onSelect(campaign)}>
					<div className='flex items-start justify-between mb-3'>
						<div className='flex-1 min-w-0'>
							<h3 className='font-semibold truncate'>{campaign.name}</h3>
							<p className='text-xs text-muted-foreground truncate'>{campaign.subject}</p>
						</div>
						<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
							<Button
								size='sm'
								variant='ghost'
								className='h-8 w-8 p-0'
								onClick={(e) => {
									e.stopPropagation();
									onDuplicate(campaign);
								}}>
								<Copy className='h-4 w-4' />
							</Button>
							<Button
								size='sm'
								variant='ghost'
								className='h-8 w-8 p-0'
								onClick={(e) => {
									e.stopPropagation();
									// Edit action
								}}>
								<Pencil className='h-4 w-4' />
							</Button>
							<Button
								size='sm'
								variant='ghost'
								className='h-8 w-8 p-0 text-destructive'
								onClick={(e) => {
									e.stopPropagation();
									onDelete(campaign);
								}}>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					</div>

					<div className='flex flex-wrap gap-2 mb-3'>
						<span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[campaign.status as CampaignStatus] || STATUS_COLORS.draft}`}>{campaign.status}</span>
						<span className='text-xs px-2 py-1 rounded-full border bg-muted'>{campaign.local}</span>
						{campaign.type && <span className='text-xs px-2 py-1 rounded-full border bg-muted'>{campaign.type}</span>}
					</div>

					{campaign.description && <p className='text-xs text-muted-foreground line-clamp-2 mb-3'>{campaign.description}</p>}

					<div className='text-xs text-muted-foreground pt-3 border-t'>
						<div>Created: {new Date(campaign.createDate).toLocaleDateString()}</div>
						<div>Modified: {new Date(campaign.modifyDate).toLocaleDateString()}</div>
					</div>
				</div>
			))}
		</div>
	);
}
