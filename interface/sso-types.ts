export interface SSOResult {
	currentProfile: string;
	verificationCode: string;
	ssoUrl: string;
}

export type ProfileLoginStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProfileStatus {
	[profileName: string]: ProfileLoginStatus;
}

export interface AuthStatus {
	[profileName: string]: {
		authenticated: boolean;
		identity?: AuthIdentity;
		loading: boolean;
	};
}

export interface AWSProfile {
	name: string;
	displayName: string;
	accountId: string;
}

export interface AuthIdentity {
	UserId: string;
	Account: string;
	Arn: string;
}

export interface AuthenticationComponent {
	currentProfile: string;
	verificationCode: string;
	ssoUrl: string;
	onCopy: (text: string) => void;
}
