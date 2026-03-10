import type { AuthStatus, AWSProfile, ProfileStatus } from '../types';
import { AuthStatusBadge } from './auth-status-badge';
import { ConnectButton } from './connect-button';

interface ProfileCardProps {
	profile: AWSProfile;
	profileStatus: ProfileStatus;
	authStatus: AuthStatus;
	onConnect: (profile: AWSProfile) => void;
}

export function ProfileCard({ profile, profileStatus, authStatus, onConnect }: ProfileCardProps) {
	const auth = authStatus[profile.name];

	return (
		<div className='flex items-center justify-between p-4 border rounded-lg'>
			<div className='flex-1'>
				<div className='flex items-center gap-2 mb-1'>
					<h3 className='font-semibold'>{profile.displayName}</h3>
					<AuthStatusBadge profile={profile} authStatus={authStatus} />
				</div>
				<p className='text-sm text-muted-foreground'>Account: {profile.accountId}</p>
				{auth?.authenticated && auth.identity && <p className='text-xs text-muted-foreground mt-1'>Logged in as: {auth.identity.UserId}</p>}
			</div>
			<ConnectButton profile={profile} profileStatus={profileStatus} authStatus={authStatus} onConnect={onConnect} />
		</div>
	);
}
