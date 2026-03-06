'use client';

import { Button } from '@/components/ui/button';
import { useAwsAuthStatus } from '@/hooks/use-aws-auth-status';
import { AWS_PROFILES } from '@/lib/aws-profiles';
import { AWSProfile, ProfileStatus } from '@/types/aws-sso';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ProfileCard } from './aws-sso/profile-card';
import { VerificationBox } from './aws-sso/verification-box';

export function AwsSsoConnect() {
	const [profileStatus, setProfileStatus] = useState<ProfileStatus>({});
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [ssoUrl, setSsoUrl] = useState<string>('');
	const [verificationCode, setVerificationCode] = useState<string>('');
	const [currentProfile, setCurrentProfile] = useState<string>('');

	const { authStatus, isChecking, checkAllAuthStatus } = useAwsAuthStatus();

	const handleRefreshStatus = () => {
		checkAllAuthStatus(AWS_PROFILES.map((p) => p.name));
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const openInBrowser = (url: string) => {
		window.open(url, '_blank');
	};

	const handleSsoLogin = async (profile: AWSProfile) => {
		setProfileStatus((prev) => ({ ...prev, [profile.name]: 'loading' }));
		setErrorMessage('');
		setSsoUrl('');
		setVerificationCode('');
		setCurrentProfile(profile.displayName);

		try {
			const response = await fetch('/api/aws-sso/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ profile: profile.name }),
			});

			const data = await response.json();

			if (response.ok && data.verificationUrl) {
				setSsoUrl(data.verificationUrl);

				if (data.verificationCode) {
					setVerificationCode(data.verificationCode);
				}

				setProfileStatus((prev) => ({ ...prev, [profile.name]: 'success' }));
			} else {
				setProfileStatus((prev) => ({ ...prev, [profile.name]: 'error' }));
				setErrorMessage(data.details || data.error || 'Failed to get authentication URL');
			}
		} catch {
			setProfileStatus((prev) => ({ ...prev, [profile.name]: 'error' }));
			setErrorMessage('Network error occurred');
		}
	};

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold'>AWS Accounts</h3>
				<Button onClick={handleRefreshStatus} disabled={isChecking} variant='outline' size='sm'>
					<RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
					{isChecking ? 'Checking...' : 'Refresh Status'}
				</Button>
			</div>

			<div className='flex flex-col gap-3'>
				{AWS_PROFILES.map((profile) => (
					<ProfileCard key={profile.name} profile={profile} profileStatus={profileStatus} authStatus={authStatus} onConnect={handleSsoLogin} />
				))}
			</div>

			{ssoUrl && <VerificationBox currentProfile={currentProfile} verificationCode={verificationCode} ssoUrl={ssoUrl} onCopy={copyToClipboard} onOpenBrowser={openInBrowser} />}

			{errorMessage && (
				<div className='p-4 border border-destructive rounded-lg bg-destructive/10'>
					<p className='text-sm text-destructive flex items-start gap-2'>
						<AlertCircle className='h-4 w-4 mt-0.5 flex-shrink-0' />
						<span className='break-all'>{errorMessage}</span>
					</p>
				</div>
			)}
		</div>
	);
}
