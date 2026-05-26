'use client';

import { AWS_PROFILES } from '@/config/aws-profiles';
import { useAwsAuthStatus } from '@/hooks/use-aws-auth-status';
import type { AWSProfile, ProfileStatus, SSOResult } from '@/types/aws-sso';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ProfileCard } from './profile-card';
import { VerificationBox } from './verification-box';

export function SSOAuthenticationPage() {
	const { authStatus, checkAllAuthStatus, isChecking } = useAwsAuthStatus();
	const [profileStatus, setProfileStatus] = useState<ProfileStatus>({});
	const [errorMessage, setErrorMessage] = useState('');
	const [ssoResult, setSsoResult] = useState<SSOResult | null>(null);

	const handleConnect = async (profile: AWSProfile) => {
		setProfileStatus((prev) => ({ ...prev, [profile.name]: 'loading' }));
		setErrorMessage('');
		setSsoResult(null);

		const res = await fetch('/api/aws-sso/login', {
			body: JSON.stringify({ profile: profile.name }),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		});

		const data = (await res.json()) as { error?: string; verificationCode?: string; verificationUrl?: string };

		if (!res.ok) {
			setProfileStatus((prev) => ({ ...prev, [profile.name]: 'error' }));
			setErrorMessage(data.error ?? 'Login failed');
			return;
		}

		setProfileStatus((prev) => ({ ...prev, [profile.name]: 'success' }));
		setSsoResult({
			currentProfile: profile.displayName,
			ssoUrl: data.verificationUrl ?? '',
			verificationCode: data.verificationCode ?? '',
		});
	};

	const handleRefresh = () => {
		setSsoResult(null);
		void checkAllAuthStatus(AWS_PROFILES.map((p) => p.name));
	};

	return (
		<div className='mx-auto space-y-6'>
			<div className='flex items-start justify-between'>
				<div>
					<h2 className='font-montserrat text-2xl font-black'>AWS Accounts</h2>
					<p className='font-montserrat font-light text-muted-foreground'>Connect to your AWS accounts via SSO.</p>
				</div>
				<Button onClick={handleRefresh} disabled={isChecking} variant='outline' size='sm' className='font-montserrat font-semibold'>
					<RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
					{isChecking ? 'Checking...' : 'Refresh Status'}
				</Button>
			</div>

			<div className='flex flex-col gap-3'>
				{AWS_PROFILES.map((profile) => (
					<ProfileCard
						key={profile.name}
						profile={profile}
						profileStatus={profileStatus}
						authStatus={authStatus}
						onConnect={(p) => void handleConnect(p)}
					/>
				))}
			</div>

			{ssoResult && <VerificationBox currentProfile={ssoResult.currentProfile} verificationCode={ssoResult.verificationCode} ssoUrl={ssoResult.ssoUrl} />}

			{errorMessage && (
				<div className='rounded-lg border border-destructive bg-destructive/10 p-4'>
					<p className='flex items-start gap-2 font-montserrat text-sm font-light text-destructive'>
						<AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
						<span className='break-all'>{errorMessage}</span>
					</p>
				</div>
			)}
		</div>
	);
}
