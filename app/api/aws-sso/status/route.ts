import { getAuthStatus } from '@/services/aws-sso';

export async function POST(request: Request) {
	const { profile } = (await request.json()) as { profile: string };

	if (!profile) {
		return Response.json({ error: 'Profile name is required' }, { status: 400 });
	}

	const result = await getAuthStatus(profile);
	return Response.json({ ...result, profile });
}
