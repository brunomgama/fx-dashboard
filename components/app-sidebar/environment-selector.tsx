'use client';

import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ENVIRONMENTS } from '@/lib/environments';
import { Server } from 'lucide-react';

export function EnvironmentSelector() {
	const { environment, setEnvironment, fullConfig } = useFlowLauncher();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton suppressHydrationWarning className={`${fullConfig.color} ${fullConfig.darkColor}`}>
						<Server />
						<span className='truncate'>{fullConfig.displayName}</span>
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent side='right' align='end'>
					{Object.values(ENVIRONMENTS).map((env) => (
						<DropdownMenuItem key={env.name} onClick={() => setEnvironment(env.name as keyof typeof ENVIRONMENTS)} className={`${environment === env.name ? `${env.color} ${env.darkColor}` : ''} cursor-pointer`}>
							<div className={`w-3 h-3 rounded-full ${env.color} ${env.darkColor} mr-2`} />
							{env.displayName}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
