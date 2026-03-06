import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import { fromIni } from '@aws-sdk/credential-providers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { profile, region, input } = await request.json();

		if (!profile || !region) {
			return NextResponse.json({ error: 'Profile and region are required' }, { status: 400 });
		}
		const credentials = fromIni({ profile });

		const sfnClient = new SFNClient({
			region,
			credentials,
		});

		const parsedInput = typeof input === 'string' ? JSON.parse(input) : input;

		const command = new StartExecutionCommand(parsedInput);
		const result = await sfnClient.send(command);

		return NextResponse.json({
			success: true,
			executionArn: result.executionArn,
			startDate: result.startDate,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('AWS Step Functions Error:', error);

		return NextResponse.json(
			{
				error: 'Failed to start Step Function execution',
				details: errorMessage,
			},
			{ status: 500 }
		);
	}
}
