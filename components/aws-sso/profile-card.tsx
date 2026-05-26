import type { AuthStatus, AWSProfile, ProfileStatus } from '@/types/aws-sso';
import { AuthStatusBadge } from './auth-status-badge';
import { ConnectButton } from './connect-button';

interface ProfileCardProps {
	authStatus: AuthStatus;
	onConnect: (profile: AWSProfile) => void;
	profile: AWSProfile;
	profileStatus: ProfileStatus;
}

export function ProfileCard({ authStatus, onConnect, profile, profileStatus }: ProfileCardProps) {
	const auth = authStatus[profile.name];

	return (
		<div className='flex items-center justify-between rounded-lg border p-4'>
			<div className='flex-1'>
				<div className='mb-1 flex items-center gap-2'>
					<h3 className='font-montserrat font-semibold'>{profile.displayName}</h3>
					<AuthStatusBadge profile={profile} authStatus={authStatus} />
				</div>
				<p className='font-montserrat text-sm font-light text-muted-foreground'>Account: {profile.accountId}</p>
				{auth?.authenticated && auth.identity && (
					<p className='mt-1 font-montserrat text-xs font-light text-muted-foreground'>Logged in as: {auth.identity.UserId}</p>
				)}
			</div>
			<ConnectButton profile={profile} profileStatus={profileStatus} authStatus={authStatus} onConnect={onConnect} />
		</div>
	);
}
