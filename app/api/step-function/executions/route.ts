import { ListExecutionsCommand, SFNClient } from '@aws-sdk/client-sfn';
import { fromIni } from '@aws-sdk/credential-providers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { arn, profile, region, limit } = await request.json();

		if (!arn || !profile || !region) {
			return NextResponse.json({ error: 'arn, profile and region are required' }, { status: 400 });
		}

		const client = new SFNClient({
			region,
			credentials: fromIni({ profile }),
		});

		// Fetch all statuses in parallel
		const statuses = ['RUNNING', 'SUCCEEDED', 'FAILED', 'TIMED_OUT', 'ABORTED'] as const;

		const [recentResult, ...countResults] = await Promise.all([
			// Recent executions (any status, limited)
			client.send(
				new ListExecutionsCommand({
					stateMachineArn: arn,
					maxResults: limit ?? 10,
				})
			),
			// Per-status counts (fetch up to 100 each for totals)
			...statuses.map((s) => client.send(new ListExecutionsCommand({ stateMachineArn: arn, statusFilter: s, maxResults: 100 }))),
		]);

		const counts = Object.fromEntries(statuses.map((s, i) => [s, countResults[i].executions?.length ?? 0]));

		return NextResponse.json({
			executions: recentResult.executions ?? [],
			counts,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Step Function executions error:', error);
		return NextResponse.json({ error: 'Failed to list executions', details: errorMessage }, { status: 500 });
	}
}
