import { AppSidebar } from '@/components/app-sidebar';
import { LanguageProvider } from '@/components/providers/language-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'My Dashboard',
	description: 'Self-hosted dashboard for managing applications',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} disableTransitionOnChange>
					<LanguageProvider>
						<TooltipProvider>
							<SidebarProvider>
								<AppSidebar />
								<main className='w-full'>{children}</main>
							</SidebarProvider>
						</TooltipProvider>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
