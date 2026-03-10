'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { loginToSSO } from '@/features/aws-sso/api';
import { ProfileCard } from '@/features/aws-sso/components/profile-card';
import { VerificationBox } from '@/features/aws-sso/components/verification-box';
import { useAwsAuthStatus } from '@/features/aws-sso/hooks/use-aws-auth-status';
import { AWSProfile, ProfileStatus } from '@/features/aws-sso/types';
import { AWS_PROFILES } from '@/lib/aws-profiles';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface SSOResult {
	currentProfile: string;
	verificationCode: string;
	ssoUrl: string;
}

export default function SSOAuthentication() {
	const [profileStatus, setProfileStatus] = useState<ProfileStatus>({});
	const [errorMessage, setErrorMessage] = useState('');
	const [ssoResult, setSsoResult] = useState<SSOResult | null>(null);

	const { authStatus, isChecking, checkAllAuthStatus } = useAwsAuthStatus();

	const handleConnect = async (profile: AWSProfile) => {
		setProfileStatus((prev) => ({ ...prev, [profile.name]: 'loading' }));
		setErrorMessage('');
		setSsoResult(null);

		try {
			const data = await loginToSSO(profile.name);
			setSsoResult({
				currentProfile: profile.displayName,
				verificationCode: data.verificationCode,
				ssoUrl: data.verificationUrl,
			});
			setProfileStatus((prev) => ({ ...prev, [profile.name]: 'success' }));
		} catch (err) {
			setProfileStatus((prev) => ({ ...prev, [profile.name]: 'error' }));
			setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
		}
	};

	return (
		<div className='flex min-h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>AWS SSO</h1>
			</header>

			<div className='flex-1 p-6'>
				<div className='mx-auto max-w-3xl space-y-6'>
					<div className='flex items-start justify-between'>
						<div>
							<h2 className='text-2xl font-bold'>AWS Accounts</h2>
							<p className='text-muted-foreground'>Connect to your AWS accounts via SSO.</p>
						</div>
						<Button onClick={() => checkAllAuthStatus(AWS_PROFILES.map((p) => p.name))} disabled={isChecking} variant='outline' size='sm'>
							<RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
							{isChecking ? 'Checking...' : 'Refresh Status'}
						</Button>
					</div>

					<div className='flex flex-col gap-3'>
						{AWS_PROFILES.map((profile) => (
							<ProfileCard key={profile.name} profile={profile} profileStatus={profileStatus} authStatus={authStatus} onConnect={handleConnect} />
						))}
					</div>

					{ssoResult && <VerificationBox currentProfile={ssoResult.currentProfile} verificationCode={ssoResult.verificationCode} ssoUrl={ssoResult.ssoUrl} onCopy={(text) => navigator.clipboard.writeText(text)} onOpenBrowser={(url) => window.open(url, '_blank')} />}

					{errorMessage && (
						<div className='rounded-lg border border-destructive bg-destructive/10 p-4'>
							<p className='flex items-start gap-2 text-sm text-destructive'>
								<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
								<span className='break-all'>{errorMessage}</span>
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
