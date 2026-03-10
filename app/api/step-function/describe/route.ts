import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
	try {
		const { arn, profile, region } = await request.json();

		if (!arn || !profile || !region) {
			return NextResponse.json({ error: 'arn, profile and region are required' }, { status: 400 });
		}

		const { stdout } = await execAsync(`aws stepfunctions describe-state-machine --state-machine-arn "${arn}" --profile ${profile} --region ${region} --output json`, { timeout: 15000 });

		const data = JSON.parse(stdout);

		return NextResponse.json({
			definition: data.definition,
			name: data.name,
			status: data.status,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';

		if (message.includes('ExpiredToken') || message.includes('not authorized')) {
			return NextResponse.json({ error: 'AWS session expired', details: 'Please reconnect via SSO on the home page' }, { status: 401 });
		}

		return NextResponse.json({ error: 'Failed to describe state machine', details: message }, { status: 500 });
	}
}
