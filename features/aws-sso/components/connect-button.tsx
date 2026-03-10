import { Button } from '@/components/ui/button';
import { AlertCircle, Check, CheckCircle, Cloud, Loader2 } from 'lucide-react';
import type { AuthStatus, AWSProfile, ProfileStatus } from '../types';

interface ConnectButtonProps {
	profile: AWSProfile;
	profileStatus: ProfileStatus;
	authStatus: AuthStatus;
	onConnect: (profile: AWSProfile) => void;
}

export function ConnectButton({ profile, profileStatus, authStatus, onConnect }: ConnectButtonProps) {
	const status = profileStatus[profile.name] || 'idle';
	const auth = authStatus[profile.name];

	const getButtonContent = () => {
		if (auth?.authenticated) {
			return (
				<>
					<CheckCircle className='mr-2 h-4 w-4 text-green-500' />
					Authenticated
				</>
			);
		}

		switch (status) {
			case 'loading':
				return (
					<>
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						Connecting...
					</>
				);
			case 'success':
				return (
					<>
						<Check className='mr-2 h-4 w-4' />
						Ready to Authenticate
					</>
				);
			case 'error':
				return (
					<>
						<AlertCircle className='mr-2 h-4 w-4' />
						Retry
					</>
				);
			default:
				return (
					<>
						<Cloud className='mr-2 h-4 w-4' />
						Connect to AWS
					</>
				);
		}
	};

	return (
		<Button onClick={() => onConnect(profile)} disabled={status === 'loading' || auth?.authenticated} variant={auth?.authenticated ? 'default' : 'outline'} className={status === 'error' ? 'border-destructive text-destructive' : ''}>
			{getButtonContent()}
		</Button>
	);
}
