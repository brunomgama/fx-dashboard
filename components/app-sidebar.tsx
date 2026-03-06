'use client';

import { Calendar, Globe, Home, Mail, Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLanguage } from '@/components/providers/language-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function AppSidebar() {
	const { theme, setTheme } = useTheme();
	const { language, setLanguage, t } = useLanguage();
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
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className='text-lg font-semibold'>{t.dashboard.title}</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
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
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					{/* Theme Selector */}
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									{theme === 'dark' ? <Moon /> : <Sun />}
									<span>{t.settings.theme}</span>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side='right' align='end'>
								<DropdownMenuItem onClick={() => setTheme('light')}>
									<Sun className='mr-2 h-4 w-4' />
									{t.settings.light}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme('dark')}>
									<Moon className='mr-2 h-4 w-4' />
									{t.settings.dark}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>

					{/* Language Selector */}
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<Globe />
									<span>{t.settings.language}</span>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side='right' align='end'>
								<DropdownMenuItem onClick={() => setLanguage('en')}>{t.languages.en}</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setLanguage('pt')}>{t.languages.pt}</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
