import { useCallback, useState } from 'react';
import { getAuthStatus } from '../api';
import type { AuthStatus } from '../types';

export function useAwsAuthStatus() {
	const [authStatus, setAuthStatus] = useState<AuthStatus>({});
	const [isChecking, setIsChecking] = useState(false);

	const checkAuthStatus = useCallback(async (profileName: string) => {
		setAuthStatus((prev) => ({
			...prev,
			[profileName]: { ...prev[profileName], loading: true, authenticated: false },
		}));

		try {
			const data = await getAuthStatus(profileName);
			setAuthStatus((prev) => ({
				...prev,
				[profileName]: { authenticated: data.authenticated, identity: data.identity, loading: false },
			}));
		} catch {
			setAuthStatus((prev) => ({
				...prev,
				[profileName]: { authenticated: false, loading: false },
			}));
		}
	}, []);

	const checkAllAuthStatus = useCallback(
		async (profiles: string[]) => {
			setIsChecking(true);
			await Promise.all(profiles.map(checkAuthStatus));
			setIsChecking(false);
		},
		[checkAuthStatus]
	);

	return { authStatus, isChecking, checkAuthStatus, checkAllAuthStatus };
}
