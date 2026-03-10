export type Environment = 'jaimy-staging' | 'jaimy-prod' | 'asr-staging' | 'asr-prod';

// Keep for backward compatibility
export type EmailEnvironment = Environment;

// Campaign Status Types
export type CampaignStatus = 'draft' | 'planned' | 'sending' | 'sent' | 'archived' | 'incomplete';

export const STATUS_COLORS: Record<CampaignStatus, string> = {
	draft: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300',
	planned: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
	sending: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300',
	sent: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300',
	archived: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300',
	incomplete: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300',
} as const;

// Email Service Quick Links
export interface EmailQuickLink {
	title: string;
	description: string;
	icon: string; // Icon name for lucide-react
	href: string;
	count: number | null;
	color: string;
}

export const EMAIL_QUICK_LINKS: EmailQuickLink[] = [
	{
		title: 'Campaigns',
		description: 'Create and manage email campaigns',
		icon: 'Mail',
		href: '/emails/campaigns',
		count: null,
		color: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200',
	},
	{
		title: 'Templates',
		description: 'Design and edit email templates',
		icon: 'FileText',
		href: '/emails/templates',
		count: null,
		color: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-200',
	},
	{
		title: 'Audiences',
		description: 'Manage recipient lists and segments',
		icon: 'Users',
		href: '/emails/audiences',
		count: null,
		color: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200',
	},
	{
		title: 'Senders',
		description: 'Configure email sender identities',
		icon: 'Send',
		href: '/emails/senders',
		count: null,
		color: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-200',
	},
	{
		title: 'Status',
		description: 'View SES metrics and delivery status',
		icon: 'BarChart3',
		href: '/emails/status',
		count: null,
		color: 'bg-cyan-50 border-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:border-cyan-800 dark:text-cyan-200',
	},
	{
		title: 'Settings',
		description: 'Configure email service settings',
		icon: 'Settings',
		href: '/emails/settings',
		count: null,
		color: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/30 dark:border-gray-800 dark:text-gray-200',
	},
];

// Campaign Types
export interface Campaign {
	id: string;
	name: string;
	local: string;
	audienceId: string;
	senderId: string;
	senderAlias: string;
	subject: string;
	content: string;
	templateId: string;
	type: string;
	status: CampaignStatus;
	previousStatus: string;
	description?: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

// Template Types
export interface Template {
	id: string;
	name: string;
	locale: string;
	emailType: string;
	header: string;
	footer: string;
	status: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

// Audience Types
export interface Audience {
	id: string;
	name: string;
	local: string;
	definition?: string;
	audienceTypeId: string;
	emailType: string;
	sql: string;
	countRecipients: number;
	active: boolean;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

export interface AudienceType {
	id: string;
	name: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

// Sender Types
export interface Sender {
	id: string;
	email: string;
	alias: string[];
	emailTypes: string[];
	active: boolean;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

// Settings Types
export interface Setting {
	id: string;
	value: string;
	createDate: string;
	createUser: string;
	modifyDate: string;
	modifyUser: string;
}

// Unsubscribe Types
export interface Unsubscribe {
	email: string;
	emailType: string;
	campaignId?: string;
	unsubscribeDate: string;
}

// Status/Metrics Types
export interface EmailMetrics {
	sent: number;
	queued: number;
	scheduled: number;
	failed: number;
	bounced: number;
	complaints: number;
}

export interface CloudWatchMetric {
	MetricName: string;
	Timestamp: string;
	Value: number;
	Unit: string;
}

export interface SESReputationMetrics {
	bounceRate: number;
	complaintRate: number;
}

export interface SESSendQuota {
	max24HourSend: number;
	maxSendRate: number;
	sentLast24Hours: number;
}

export interface SESStatusResponse {
	reputationMetrics?: SESReputationMetrics;
	sendQuota?: SESSendQuota;
	cloudWatchMetrics?: CloudWatchMetric[];
	statistics?: {
		Sends?: number;
		Rejects?: number;
		Bounces?: number;
		Complaints?: number;
		DeliveryAttempts?: number;
	};
}

// List Response
export interface ListResponse<T> {
	results?: T[];
	Items?: T[];
	items?: T[];
	count?: number;
	lastEvaluatedKey?: string;
}

// Request Types
export interface ListParams {
	limit?: number;
	lastKey?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	[key: string]: string | number | undefined;
}
