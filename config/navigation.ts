import type { NavigationItem } from '@/types/navigation';
import { Home } from 'lucide-react';

export const NAV_ITEMS: NavigationItem[] = [
	{
		icon: Home,
		title: 'Home',
		url: '/',
	},
];

export function getDefaultOpenGroups(): string[] {
	return NAV_ITEMS.filter((item) => item.children).map((item) => item.title);
}
