export interface AWSProfile {
	accountId: string;
	displayName: string;
	name: string;
}

export interface AuthIdentity {
	Account: string;
	Arn: string;
	UserId: string;
}

export interface AuthStatusEntry {
	authenticated: boolean;
	identity?: AuthIdentity;
	loading: boolean;
}

export interface AuthStatus {
	[profileName: string]: AuthStatusEntry;
}

export type ProfileLoginStatus = 'error' | 'idle' | 'loading' | 'success';

export interface ProfileStatus {
	[profileName: string]: ProfileLoginStatus;
}

export interface SSOResult {
	currentProfile: string;
	ssoUrl: string;
	verificationCode: string;
}
