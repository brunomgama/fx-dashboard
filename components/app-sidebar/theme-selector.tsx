'use client';

import { useLanguage } from '@/components/providers/language-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeSelector() {
	const { theme, setTheme } = useTheme();
	const { t } = useLanguage();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton suppressHydrationWarning>
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
	);
}
