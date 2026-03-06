import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
	let profile = '';

	try {
		const body = await request.json();
		profile = body.profile;

		if (!profile) {
			return NextResponse.json({ error: 'Profile name is required' }, { status: 400 });
		}

		// Check SSO session status
		const { stdout } = await execAsync(`aws sts get-caller-identity --profile ${profile}`, { timeout: 10000 });

		const identity = JSON.parse(stdout);

		return NextResponse.json({
			authenticated: true,
			profile: profile,
			identity,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		return NextResponse.json({
			authenticated: false,
			profile: profile,
			error: errorMessage,
		});
	}
}
