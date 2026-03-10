import { AppSidebar } from '@/components/layout/app-sidebar';
import { EnvironmentProvider } from '@/components/providers/environment-provider';
import { LanguageProvider } from '@/components/providers/language-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'My Dashboard',
	description: 'Self-hosted AWS dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} disableTransitionOnChange>
					<LanguageProvider>
						<EnvironmentProvider>
							<TooltipProvider>
								<SidebarProvider>
									<AppSidebar />
									<main className='w-full'>{children}</main>
								</SidebarProvider>
							</TooltipProvider>
						</EnvironmentProvider>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
