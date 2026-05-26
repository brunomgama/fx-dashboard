'use client';

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { getDefaultOpenGroups, NAV_ITEMS } from '@/config/navigation';
import type { NavigationItem } from '@/types/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type JSX, useState } from 'react';

export function SidebarNavigation() {
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
							<item.icon className="h-4 w-4" />
							<span className="font-montserrat font-light">{item.title}</span>
							<ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
						</SidebarMenuButton>
						{isOpen && <SidebarMenuSub>{renderNavItems(item.children, level + 1)}</SidebarMenuSub>}
					</SidebarMenuItem>
				);
			}

			return (
				<SidebarMenuItem key={item.url} className={level === 1 ? 'pl-4' : level === 2 ? 'pl-8' : ''}>
					<SidebarMenuButton asChild isActive={pathname === item.url}>
						<Link href={item.url!}>
							<item.icon className="h-4 w-4" />
							<span className="font-montserrat font-light">{item.title}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			);
		});
	}

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>{renderNavItems(NAV_ITEMS)}</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
