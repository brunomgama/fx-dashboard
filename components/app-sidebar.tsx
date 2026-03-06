'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu } from '@/components/ui/sidebar';
import { EnvironmentSelector } from './app-sidebar/environment-selector';
import { LanguageSelector } from './app-sidebar/language-selector';
import { NavigationMenu } from './app-sidebar/navigation-menu';
import { ThemeSelector } from './app-sidebar/theme-selector';

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<NavigationMenu />
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
