import type { NavigationItem } from '@/types/navigation';
import { CalendarClock, Home, KeyRound, Rocket, Settings2, Zap } from 'lucide-react';

export const NAV_ITEMS: NavigationItem[] = [
	{
		icon: Home,
		title: 'Home',
		url: '/',
	},
	{
		icon: KeyRound,
		title: 'AWS SSO',
		url: '/sso-authentication',
	},
	{
		children: [
			{ icon: Rocket, title: 'Flows', url: '/flow-launcher/flows' },
			{ icon: Zap, title: 'Events', url: '/flow-launcher/events' },
			{ icon: Settings2, title: 'Event Configs', url: '/flow-launcher/event-config' },
		],
		icon: CalendarClock,
		title: 'Flow Launcher',
	},
];

export function getDefaultOpenGroups(): string[] {
	return NAV_ITEMS.filter((item) => item.children).map((item) => item.title);
}
