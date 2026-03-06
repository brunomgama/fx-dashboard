export interface AWSProfile {
	name: string;
	displayName: string;
	accountId: string;
	ssoSession: string;
}

export interface ProfileStatus {
	[key: string]: 'idle' | 'loading' | 'success' | 'error';
}

export interface AuthStatus {
	[key: string]: {
		authenticated: boolean;
		identity?: {
			UserId: string;
			Account: string;
			Arn: string;
		};
		loading: boolean;
	};
}
