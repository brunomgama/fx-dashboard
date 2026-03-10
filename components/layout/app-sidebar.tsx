'use client';

import { useEnvironment } from '@/components/providers/environment-provider';
import { useLanguage } from '@/components/providers/language-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { ENVIRONMENTS } from '@/lib/environment';
import type { Environment } from '@/lib/types';
import { ChevronRight, Globe, Home, Key, Mail, Moon, Puzzle, Server, Settings, Sun, Workflow, Wrench, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_ITEMS = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
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
	{
		title: 'Email Service',
		url: '/email-service',
		icon: Mail,
	},
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarTitle />
				<SidebarNavigation />
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<EnvironmentSelector />
					<ThemeSelector />
					<LanguageSelector />
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

// ─── Title ────────────────────────────────────────────────────────────────────

function SidebarTitle() {
	const { t } = useLanguage();
	return (
		<SidebarGroup>
			<SidebarGroupLabel className='text-lg font-semibold'>{t.dashboard.title}</SidebarGroupLabel>
		</SidebarGroup>
	);
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function SidebarNavigation() {
	const pathname = usePathname();
	const [openGroups, setOpenGroups] = useState<string[]>(['AWS']);

	const toggleGroup = (title: string) => {
		setOpenGroups((prev) => (prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]));
	};

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{NAV_ITEMS.map((item) => {
						if (item.children) {
							const isOpen = openGroups.includes(item.title);
							return (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton onClick={() => toggleGroup(item.title)}>
										<item.icon className='h-4 w-4' />
										<span>{item.title}</span>
										<ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
									</SidebarMenuButton>
									{isOpen && (
										<SidebarMenuSub>
											{item.children.map((child) => (
												<SidebarMenuSubItem key={child.url}>
													<SidebarMenuSubButton asChild isActive={pathname === child.url}>
														<Link href={child.url}>
															<child.icon className='h-4 w-4' />
															<span>{child.title}</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									)}
								</SidebarMenuItem>
							);
						}

						return (
							<SidebarMenuItem key={item.url}>
								<SidebarMenuButton asChild isActive={pathname === item.url}>
									<Link href={item.url!}>
										<item.icon className='h-4 w-4' />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}

// ─── Footer selectors ─────────────────────────────────────────────────────────

function EnvironmentSelector() {
	const { environment, config, setEnvironment } = useEnvironment();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton suppressHydrationWarning className={`${config.color} ${config.darkColor}`}>
						<Server className='h-4 w-4' />
						<span className='truncate'>{config.displayName}</span>
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent side='right' align='end'>
					{Object.values(ENVIRONMENTS).map((env) => (
						<DropdownMenuItem key={env.name} onClick={() => setEnvironment(env.name as Environment)} className={`${environment === env.name ? `${env.color} ${env.darkColor}` : ''} cursor-pointer`}>
							<div className={`mr-2 h-3 w-3 rounded-full ${env.color}`} />
							{env.displayName}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}

function ThemeSelector() {
	const { theme, setTheme } = useTheme();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton suppressHydrationWarning>
						{theme === 'dark' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
						<span>Theme</span>
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent side='right' align='end'>
					<DropdownMenuItem onClick={() => setTheme('light')}>
						<Sun className='mr-2 h-4 w-4' /> Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('dark')}>
						<Moon className='mr-2 h-4 w-4' /> Dark
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}

function LanguageSelector() {
	const { setLanguage, t } = useLanguage();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton>
						<Globe className='h-4 w-4' />
						<span>{t.settings.language}</span>
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent side='right' align='end'>
					<DropdownMenuItem onClick={() => setLanguage('en')}>{t.languages.en}</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setLanguage('pt')}>{t.languages.pt}</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
