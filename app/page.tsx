'use client';

import { AwsSsoConnect } from '@/components/aws-sso-connect';
import { useLanguage } from '@/components/providers/language-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Home() {
	const { t } = useLanguage();

	return (
		<div className='flex flex-col min-h-screen'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>{t.navigation.home}</h1>
			</header>
			<div className='flex-1 p-6'>
				<div className='mx-auto max-w-6xl space-y-8'>
					<div>
						<h2 className='text-3xl font-bold mb-4'>{t.dashboard.welcome}</h2>
						<p className='text-muted-foreground'>This is your self-hosted dashboard for managing all your applications.</p>
					</div>

					{/* AWS SSO Section */}
					<div className='space-y-4'>
						<div>
							<h3 className='text-2xl font-semibold mb-2'>{t.dashboard.awsSso}</h3>
							<p className='text-muted-foreground'>{t.dashboard.awsSsoDescription}</p>
						</div>
						<AwsSsoConnect />
					</div>
				</div>
			</div>
		</div>
	);
}
