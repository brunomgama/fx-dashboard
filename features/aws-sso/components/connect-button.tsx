import { Button } from '@/components/ui/button';
import { AlertCircle, Check, CheckCircle, Cloud, Loader2 } from 'lucide-react';
import type { AuthStatus, AWSProfile, ProfileStatus } from '../types';

interface Props {
	profile: AWSProfile;
	profileStatus: ProfileStatus;
	authStatus: AuthStatus;
	onConnect: (profile: AWSProfile) => void;
}

export function ConnectButton({ profile, profileStatus, authStatus, onConnect }: Props) {
	const status = profileStatus[profile.name] ?? 'idle';
	const auth = authStatus[profile.name];

	if (auth?.authenticated) {
		return (
			<Button disabled variant='default'>
				<CheckCircle className='mr-2 h-4 w-4 text-green-500' /> Authenticated
			</Button>
		);
	}

	const variants: Record<string, { label: string; icon: React.ReactNode; disabled: boolean; className?: string }> = {
		loading: { label: 'Connecting...', icon: <Loader2 className='mr-2 h-4 w-4 animate-spin' />, disabled: true },
		success: { label: 'Ready to Authenticate', icon: <Check className='mr-2 h-4 w-4' />, disabled: false },
		error: { label: 'Retry', icon: <AlertCircle className='mr-2 h-4 w-4' />, disabled: false, className: 'border-destructive text-destructive' },
		idle: { label: 'Connect to AWS', icon: <Cloud className='mr-2 h-4 w-4' />, disabled: false },
	};

	const v = variants[status] ?? variants.idle;

	return (
		<Button onClick={() => onConnect(profile)} disabled={v.disabled} variant='outline' className={v.className}>
			{v.icon}
			{v.label}
		</Button>
	);
}
