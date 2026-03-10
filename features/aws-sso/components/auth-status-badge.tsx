import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import type { AWSProfile, AuthStatus } from '../types';

interface AuthStatusBadgeProps {
	profile: AWSProfile;
	authStatus: AuthStatus;
}

export function AuthStatusBadge({ profile, authStatus }: AuthStatusBadgeProps) {
	const auth = authStatus[profile.name];

	if (auth?.loading) {
		return (
			<span className='flex items-center text-xs text-muted-foreground'>
				<Loader2 className='mr-1 h-3 w-3 animate-spin' />
				Checking...
			</span>
		);
	}

	if (auth?.authenticated) {
		return (
			<span className='flex items-center text-xs text-green-600 dark:text-green-500'>
				<CheckCircle className='mr-1 h-3 w-3' />
				Active Session
			</span>
		);
	}

	return (
		<span className='flex items-center text-xs text-muted-foreground'>
			<XCircle className='mr-1 h-3 w-3' />
			Not Authenticated
		</span>
	);
}
