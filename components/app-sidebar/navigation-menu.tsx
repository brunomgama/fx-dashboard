'use client';

import { useLanguage } from '@/components/providers/language-provider';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Calendar, Home, Mail, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavigationMenu() {
	const { t } = useLanguage();
	const pathname = usePathname();

	const navItems = [
		{
			title: t.navigation.home,
			url: '/',
			icon: Home,
		},
		{
			title: t.navigation.flowLauncher,
			url: '/flow-launcher',
			icon: Zap,
		},
		{
			title: t.navigation.emails,
			url: '/emails',
			icon: Mail,
		},
		{
			title: t.navigation.smartEvents,
			url: '/smart-events',
			icon: Calendar,
		},
	];

	return (
		<SidebarGroup>
			<SidebarGroupLabel className='text-lg font-semibold'>{t.dashboard.title}</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu className='mt-6'>
					{navItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={pathname === item.url}>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
