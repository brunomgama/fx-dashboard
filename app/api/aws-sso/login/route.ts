import { loginToSSO } from '@/services/aws-sso';

export async function POST(request: Request) {
	const { profile } = (await request.json()) as { profile: string };

	if (!profile) {
		return Response.json({ error: 'Profile name is required' }, { status: 400 });
	}

	try {
		const result = await loginToSSO(profile);
		return Response.json({ ...result, success: true });
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Login failed' }, { status: 500 });
	}
}
