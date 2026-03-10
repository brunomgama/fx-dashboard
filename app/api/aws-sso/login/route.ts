import { spawn } from 'child_process';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { profile } = await request.json();

		if (!profile) {
			return NextResponse.json({ error: 'Profile name is required' }, { status: 400 });
		}

		// Run AWS SSO login in background and capture output immediately
		const awsProcess = spawn('aws', ['sso', 'login', '--profile', profile, '--no-browser']);

		let output = '';
		let verificationUrl = '';
		let verificationCode = '';
		let resolved = false;

		return new Promise<NextResponse>((resolve) => {
			// Capture stdout
			awsProcess.stdout.on('data', (data) => {
				const chunk = data.toString();
				output += chunk;

				// Try to extract URL and code as soon as we get data
				if (!resolved) {
					const urlMatch = output.match(/https:\/\/[^\s]+/);
					const codeMatch = output.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/);

					if (urlMatch) {
						verificationUrl = urlMatch[0];
						verificationCode = codeMatch ? codeMatch[1] : '';
						resolved = true;

						// Return immediately once we have the URL
						resolve(
							NextResponse.json({
								success: true,
								message: 'Please complete authentication in your browser',
								verificationUrl: verificationUrl,
								verificationCode: verificationCode,
							})
						);
					}
				}
			});

			// Capture stderr (AWS CLI sometimes outputs here)
			awsProcess.stderr.on('data', (data) => {
				const chunk = data.toString();
				output += chunk;

				// Try to extract URL and code from stderr too
				if (!resolved) {
					const urlMatch = output.match(/https:\/\/[^\s]+/);
					const codeMatch = output.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/);

					if (urlMatch) {
						verificationUrl = urlMatch[0];
						verificationCode = codeMatch ? codeMatch[1] : '';
						resolved = true;

						// Return immediately once we have the URL
						resolve(
							NextResponse.json({
								success: true,
								message: 'Please complete authentication in your browser',
								verificationUrl: verificationUrl,
								verificationCode: verificationCode,
							})
						);
					}
				}
			});

			// Timeout after 5 seconds if we don't get URL
			setTimeout(() => {
				if (!resolved) {
					resolved = true;
					resolve(
						NextResponse.json(
							{
								error: 'Could not extract verification URL from AWS SSO output',
								details: output,
							},
							{ status: 500 }
						)
					);
				}
			}, 5000);

			// Handle process errors
			awsProcess.on('error', (error) => {
				if (!resolved) {
					resolved = true;
					resolve(
						NextResponse.json(
							{
								error: 'Failed to start AWS SSO login',
								details: error.message,
							},
							{ status: 500 }
						)
					);
				}
			});
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		console.error('AWS SSO Login Error:', error);
		return NextResponse.json(
			{
				error: 'Failed to login to AWS SSO',
				details: errorMessage,
			},
			{ status: 500 }
		);
	}
}
