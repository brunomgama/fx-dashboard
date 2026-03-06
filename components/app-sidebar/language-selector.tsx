'use client';

import { useLanguage } from '@/components/providers/language-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
	const { setLanguage, t } = useLanguage();

	return (
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
	);
}
