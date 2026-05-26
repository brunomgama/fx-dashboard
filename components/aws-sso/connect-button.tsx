import { Button } from '@/components/ui/button';
import type { AuthStatus, AWSProfile, ProfileStatus } from '@/types/aws-sso';
import { AlertCircle, Check, CheckCircle, Cloud, Loader2 } from 'lucide-react';

interface ConnectButtonProps {
	authStatus: AuthStatus;
	onConnect: (profile: AWSProfile) => void;
	profile: AWSProfile;
	profileStatus: ProfileStatus;
}

export function ConnectButton({ authStatus, onConnect, profile, profileStatus }: ConnectButtonProps) {
	const status = profileStatus[profile.name] ?? 'idle';
	const auth = authStatus[profile.name];

	if (auth?.authenticated) {
		return (
			<Button disabled variant='default' className='font-montserrat font-semibold'>
				<CheckCircle className='mr-2 h-4 w-4 text-green-500' /> Authenticated
			</Button>
		);
	}

	const variants: Record<string, { className?: string; disabled: boolean; icon: React.ReactNode; label: string }> = {
		error: { className: 'border-destructive text-destructive', disabled: false, icon: <AlertCircle className='mr-2 h-4 w-4' />, label: 'Retry' },
		idle: { disabled: false, icon: <Cloud className='mr-2 h-4 w-4' />, label: 'Connect to AWS' },
		loading: { disabled: true, icon: <Loader2 className='mr-2 h-4 w-4 animate-spin' />, label: 'Connecting...' },
		success: { disabled: false, icon: <Check className='mr-2 h-4 w-4' />, label: 'Ready to Authenticate' },
	};

	const v = variants[status] ?? variants['idle'];

	return (
		<Button onClick={() => onConnect(profile)} disabled={v.disabled} variant='outline' className={`font-montserrat font-semibold ${v.className ?? ''}`}>
			{v.icon}
			{v.label}
		</Button>
	);
}
