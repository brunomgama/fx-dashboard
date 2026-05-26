import { describeStateMachine } from '@/services/step-function';

export async function POST(request: Request) {
	const { arn, profile, region } = (await request.json()) as { arn: string; profile: string; region: string };

	if (!arn || !profile || !region) {
		return Response.json({ error: 'arn, profile and region are required' }, { status: 400 });
	}

	try {
		return Response.json(await describeStateMachine({ arn, profile, region }));
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';

		if (message.includes('ExpiredToken') || message.includes('not authorized')) {
			return Response.json({ error: 'AWS session expired', details: 'Please reconnect via SSO on the home page' }, { status: 401 });
		}

		return Response.json({ error: 'Failed to describe state machine', details: message }, { status: 500 });
	}
}
