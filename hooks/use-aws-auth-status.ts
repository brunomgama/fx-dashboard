import { AuthStatus } from '@/types/aws-sso';
import { useCallback, useState } from 'react';

export function useAwsAuthStatus() {
	const [authStatus, setAuthStatus] = useState<AuthStatus>({});
	const [isChecking, setIsChecking] = useState(false);

	const checkAuthStatus = useCallback(async (profileName: string) => {
		setAuthStatus((prev) => ({
			...prev,
			[profileName]: { ...prev[profileName], loading: true, authenticated: false },
		}));

		try {
			const response = await fetch('/api/aws-sso/status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ profile: profileName }),
			});

			const data = await response.json();

			setAuthStatus((prev) => ({
				...prev,
				[profileName]: {
					authenticated: data.authenticated,
					identity: data.identity,
					loading: false,
				},
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
			for (const profile of profiles) {
				await checkAuthStatus(profile);
			}
			setIsChecking(false);
		},
		[checkAuthStatus]
	);

	return {
		authStatus,
		isChecking,
		checkAuthStatus,
		checkAllAuthStatus,
	};
}
