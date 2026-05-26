'use client';

import { useEnvironment } from '@/components/providers/environment-provider';
import { useLanguage } from '@/components/providers/language-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { Environment } from '@/interface/environment-profiles';
import { NavigationItem } from '@/interface/sidebar';
import { ENVIRONMENTS } from '@/lib/environment';
import { getDefaultOpenGroups, NAV_ITEMS } from '@/lib/sidebar';
import { ChevronRight, Globe, Moon, Server, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX, useState } from 'react';

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
	const [openGroups, setOpenGroups] = useState<string[]>(getDefaultOpenGroups());

	const toggleGroup = (title: string) => {
		setOpenGroups((prev) => (prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]));
	};

	function renderNavItems(items: NavigationItem[], level = 0): JSX.Element[] {
		return items.map((item) => {
			if (item.children) {
				const isOpen = openGroups.includes(item.title);
				return (
					<SidebarMenuItem key={item.title} className={level === 1 ? 'pl-4' : level === 2 ? 'pl-8' : ''}>
						<SidebarMenuButton onClick={() => toggleGroup(item.title)}>
							<item.icon className='h-4 w-4' />
							<span>{item.title}</span>
							<ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
						</SidebarMenuButton>
						{isOpen && (
							<SidebarMenuSub>
								{renderNavItems(item.children, level + 1)}
							</SidebarMenuSub>
						)}
					</SidebarMenuItem>
				);
			}

			return (
				<SidebarMenuItem key={item.url} className={level === 1 ? 'pl-4' : level === 2 ? 'pl-8' : ''}>
					<SidebarMenuButton asChild isActive={pathname === item.url}>
						<Link href={item.url!}>
							<item.icon className='h-4 w-4' />
							<span>{item.title}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		});
	}

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{renderNavItems(NAV_ITEMS)}
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
