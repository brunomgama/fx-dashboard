import { CalendarDays, CheckSquare, ClipboardList, FileText, Home, Key, ListTodo, Puzzle, Server, Settings, Workflow, Wrench, Zap } from 'lucide-react';

/**
 * Navigation item structure supporting multi-level hierarchy
 */
export type NavigationItem = {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	url?: string;
	children?: NavigationItem[];
};

/**
 * Application navigation structure
 * Three-level hierarchy: Home, Fixxer > (Organization, AWS, Flow Launcher) > children
 */
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
			{
				title: 'AWS',
				icon: Server,
				children: [
					{ title: 'Authentication', url: '/sso-authentication', icon: Key },
					{ title: 'AWS Tools', url: '/aws-tools', icon: Wrench },
				],
			},
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

/**
 * Get all navigation items with children that should be expanded by default
 */
export function getDefaultOpenGroups(): string[] {
	return NAV_ITEMS.filter((item) => item.children).map((item) => item.title);
}

