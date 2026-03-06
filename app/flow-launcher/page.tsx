'use client';

import { EventConfigsList } from '@/components/flow-launcher/eventconfig/event-configs-list';
import { EventsList } from '@/components/flow-launcher/events/events-list';
import { FlowsList } from '@/components/flow-launcher/flows/flows-list';
import { useFlowLauncher } from '@/components/providers/flow-launcher-provider';
import { useLanguage } from '@/components/providers/language-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FlowLauncherPage() {
	const { t } = useLanguage();
	const { environmentConfig } = useFlowLauncher();

	return (
		<div className='flex flex-col h-screen'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 flex-shrink-0'>
				<SidebarTrigger />
				<div className='flex-1'>
					<h1 className='text-xl font-semibold'>{t.navigation.flowLauncher}</h1>
					<p className='text-xs text-muted-foreground'>Environment: {environmentConfig.displayName}</p>
				</div>
			</header>

			<div className='flex-1 p-6 overflow-hidden min-h-0'>
				<div className='mx-auto h-full flex flex-col'>
					<Tabs defaultValue='events' className='flex flex-col flex-1 min-h-0'>
						<TabsList className='grid w-full grid-cols-3 flex-shrink-0'>
							<TabsTrigger value='events'>Events</TabsTrigger>
							<TabsTrigger value='flows'>Flows</TabsTrigger>
							<TabsTrigger value='configs'>Event Configs</TabsTrigger>
						</TabsList>

						<TabsContent value='events' className='mt-6 flex-1 min-h-0'>
							<EventsList />
						</TabsContent>

						<TabsContent value='flows' className='mt-6 flex-1 min-h-0'>
							<FlowsList />
						</TabsContent>

						<TabsContent value='configs' className='mt-6 flex-1 min-h-0'>
							<EventConfigsList />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
