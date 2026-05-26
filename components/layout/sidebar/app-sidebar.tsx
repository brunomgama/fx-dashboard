'use client';

import { useLanguage } from '@/components/providers/language-provider';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { EnvironmentSelector } from './environment-selector';
import { LanguageSelector } from './language-selector';
import { SidebarNavigation } from './navigation-sidebar';
import { ThemeSelector } from './theme-selector';

export function AppSidebar() {
	const { t } = useLanguage();
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="font-montserrat text-lg font-black">{t.dashboard.title}</SidebarGroupLabel>
				</SidebarGroup>
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
