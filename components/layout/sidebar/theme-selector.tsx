'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeSelector() {
	const { theme, setTheme } = useTheme();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton suppressHydrationWarning>
						{theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
						<span className="font-montserrat font-light">Theme</span>
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="right" align="end">
					<DropdownMenuItem onClick={() => setTheme('light')}>
						<Sun className="mr-2 h-4 w-4 font-montserrat font-light" /> Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('dark')}>
						<Moon className="mr-2 h-4 w-4 font-montserrat font-light" /> Dark
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
