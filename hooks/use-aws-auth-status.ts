import type { AuthIdentity, AuthStatus } from '@/types/aws-sso';
import { useCallback, useState } from 'react';

interface AuthStatusResponse {
	authenticated: boolean;
	identity?: AuthIdentity;
}

export function useAwsAuthStatus() {
	const [authStatus, setAuthStatus] = useState<AuthStatus>({});
	const [isChecking, setIsChecking] = useState(false);

	const checkAuthStatus = useCallback(async (profileName: string) => {
		setAuthStatus((prev) => ({
			...prev,
			[profileName]: { ...prev[profileName], authenticated: false, loading: true },
		}));

		const res = await fetch('/api/aws-sso/status', {
			body: JSON.stringify({ profile: profileName }),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		});
		const data = (await res.json()) as AuthStatusResponse;

		setAuthStatus((prev) => ({
			...prev,
			[profileName]: { authenticated: data.authenticated, identity: data.identity, loading: false },
		}));
	}, []);

	const checkAllAuthStatus = useCallback(
		async (profiles: string[]) => {
			setIsChecking(true);
			await Promise.all(profiles.map(checkAuthStatus));
			setIsChecking(false);
		},
		[checkAuthStatus],
	);

	return { authStatus, checkAllAuthStatus, checkAuthStatus, isChecking };
}
