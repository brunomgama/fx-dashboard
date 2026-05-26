'use client'

import { useEnvironment } from '@/components/providers/environment-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ENVIRONMENTS } from '@/config/environments';
import { Environment } from '@/types/environment';
import { Server } from 'lucide-react';

export function EnvironmentSelector() {
	const { environment, config, setEnvironment } = useEnvironment();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton suppressHydrationWarning className={`${config.color} ${config.darkColor}`}>
						<Server className="h-4 w-4" />
						<span className="font-montserrat font-light">{config.displayName}</span>
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="right" align="end">
					{Object.values(ENVIRONMENTS).map((env) => (
						<DropdownMenuItem
							key={env.name}
							onClick={() => setEnvironment(env.name as Environment)}
							className={`${environment === env.name ? `${env.color} ${env.darkColor}` : ''} cursor-pointer font-montserrat font-light`}
						>
							{env.displayName}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}
