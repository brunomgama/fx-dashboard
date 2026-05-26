import type { AuthStatus, AWSProfile } from '@/types/aws-sso';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

interface AuthStatusBadgeProps {
	authStatus: AuthStatus;
	profile: AWSProfile;
}

export function AuthStatusBadge({ authStatus, profile }: AuthStatusBadgeProps) {
	const auth = authStatus[profile.name];

	if (auth?.loading) {
		return (
			<span className='flex items-center font-montserrat text-xs font-light text-muted-foreground'>
				<Loader2 className='mr-1 h-3 w-3 animate-spin' /> Checking...
			</span>
		);
	}

	if (auth?.authenticated) {
		return (
			<span className='flex items-center font-montserrat text-xs font-light text-green-600 dark:text-green-500'>
				<CheckCircle className='mr-1 h-3 w-3' /> Active Session
			</span>
		);
	}

	return (
		<span className='flex items-center font-montserrat text-xs font-light text-muted-foreground'>
			<XCircle className='mr-1 h-3 w-3' /> Not Authenticated
		</span>
	);
}
