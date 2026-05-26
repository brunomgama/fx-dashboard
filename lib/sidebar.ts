import { Bot, CalendarDays, CheckSquare, ClipboardList, FileText, Home, Key, ListTodo, Puzzle, Settings, Workflow, Wrench, Zap } from 'lucide-react';

export type NavigationItem = {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	url?: string;
	children?: NavigationItem[];
};

export const NAV_ITEMS: NavigationItem[] = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Personal',
		icon: Wrench,
		children: [
			{
				title: 'Claude Code',
				url: '/claude-code',
				icon: Bot,
			},
			{
				title: 'Organization',
				icon: ClipboardList,
				children: [
					{ title: 'Calendar', url: '/organization/calendar', icon: CalendarDays },
					{ title: 'Todo', url: '/organization/todo', icon: CheckSquare },
					{ title: 'Tasks', url: '/organization/tasks', icon: ListTodo },
					{ title: 'Notes', url: '/organization/notes', icon: FileText },
				],
			},
		],
	},
	{
		title: 'Fixxer',
		icon: Wrench,
		children: [
			{ title: 'Authentication', url: '/sso-authentication', icon: Key },
			{
				title: 'Flow Launcher',
				icon: Workflow,
				children: [
					{ title: 'Flows', url: '/flow-launcher/flows', icon: Puzzle },
					{ title: 'Events', url: '/flow-launcher/events', icon: Zap },
					{ title: 'Event Configurations', url: '/flow-launcher/event-config', icon: Settings },
				],
			},
		],
	},
];

export function getDefaultOpenGroups(): string[] {
	return NAV_ITEMS.filter((item) => item.children).map((item) => item.title);
}

