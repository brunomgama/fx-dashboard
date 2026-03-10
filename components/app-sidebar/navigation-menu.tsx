'use client';

import { useLanguage } from '@/components/providers/language-provider';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Calendar, ChevronRight, Crosshair, Home, Mail, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function NavigationMenu() {
	const { t } = useLanguage();
	const pathname = usePathname();
	const [emailsOpen, setEmailsOpen] = useState(pathname.startsWith('/emails'));

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
			title: t.navigation.executions,
			url: '/executions',
			icon: Crosshair,
		},
		{
			title: t.navigation.emails,
			url: '/emails',
			icon: Mail,
			subItems: [
				{ title: 'Overview', url: '/emails' },
				{ title: 'Campaigns', url: '/emails/campaigns' },
				{ title: 'Templates', url: '/emails/templates' },
				{ title: 'Audiences', url: '/emails/audiences' },
				{ title: 'Audience Types', url: '/emails/audience-types' },
				{ title: 'Senders', url: '/emails/senders' },
				{ title: 'Settings', url: '/emails/settings' },
				{ title: 'Unsubscribes', url: '/emails/unsubscribes' },
				{ title: 'Status', url: '/emails/status' },
			],
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
							{item.subItems ? (
								<>
									<SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} onClick={() => setEmailsOpen(!emailsOpen)}>
										<div className='flex items-center cursor-pointer'>
											<item.icon />
											<span>{item.title}</span>
											<ChevronRight className={`ml-auto transition-transform ${emailsOpen ? 'rotate-90' : ''}`} />
										</div>
									</SidebarMenuButton>
									{emailsOpen && (
										<SidebarMenuSub>
											{item.subItems.map((subItem) => (
												<SidebarMenuSubItem key={subItem.url}>
													<SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
														<Link href={subItem.url}>
															<span>{subItem.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									)}
								</>
							) : (
								<SidebarMenuButton asChild isActive={pathname === item.url}>
									<Link href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
