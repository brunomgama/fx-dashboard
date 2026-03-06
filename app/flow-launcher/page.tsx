'use client';

import { useLanguage } from '@/components/providers/language-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function FlowLauncherPage() {
	const { t } = useLanguage();

	return (
		<div className='flex flex-col min-h-screen'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>{t.navigation.flowLauncher}</h1>
			</header>
			<div className='flex-1 p-6'>
				<div className='mx-auto max-w-6xl'>
					<h2 className='text-3xl font-bold mb-4'>{t.navigation.flowLauncher}</h2>
					<p className='text-muted-foreground'>Flow Launcher content will be displayed here.</p>
				</div>
			</div>
		</div>
	);
}
