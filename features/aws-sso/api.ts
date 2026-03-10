export async function loginToSSO(profile: string) {
	const res = await fetch('/api/aws-sso/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ profile }),
	});

	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.details || data.error || 'Login failed');
	}

	return data as {
		success: boolean;
		message: string;
		verificationUrl: string;
		verificationCode: string;
	};
}

export async function getAuthStatus(profile: string) {
	const res = await fetch('/api/aws-sso/status', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ profile }),
	});

	const data = await res.json();

	return data as {
		authenticated: boolean;
		profile: string;
		identity?: { UserId: string; Account: string; Arn: string };
		error?: string;
	};
}
