// app/api/step-function/describe/route.ts
import { DescribeStateMachineCommand, SFNClient } from '@aws-sdk/client-sfn';
import { fromIni } from '@aws-sdk/credential-providers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { arn, profile, region } = await request.json();

		if (!arn || !profile || !region) {
			return NextResponse.json({ error: 'arn, profile and region are required' }, { status: 400 });
		}

		const client = new SFNClient({
			region,
			credentials: fromIni({ profile }),
		});

		const result = await client.send(new DescribeStateMachineCommand({ stateMachineArn: arn }));

		return NextResponse.json({
			definition: result.definition,
			name: result.name,
			status: result.status,
			type: result.type,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Step Function describe error:', error);
		return NextResponse.json({ error: 'Failed to describe state machine', details: errorMessage }, { status: 500 });
	}
}
