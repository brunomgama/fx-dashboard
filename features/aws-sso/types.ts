export interface AWSProfile {
	name: string;
	displayName: string;
	accountId: string;
}

export type ProfileLoginStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProfileStatus {
	[profileName: string]: ProfileLoginStatus;
}

export interface AuthIdentity {
	UserId: string;
	Account: string;
	Arn: string;
}

export interface AuthStatus {
	[profileName: string]: {
		authenticated: boolean;
		identity?: AuthIdentity;
		loading: boolean;
	};
}
