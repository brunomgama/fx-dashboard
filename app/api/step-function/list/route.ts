import { ListStateMachinesCommand, SFNClient, StateMachineListItem } from '@aws-sdk/client-sfn';
import { fromIni } from '@aws-sdk/credential-providers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { profile, region } = await request.json();

		if (!profile || !region) {
			return NextResponse.json({ error: 'profile and region are required' }, { status: 400 });
		}

		const client = new SFNClient({
			region,
			credentials: fromIni({ profile }),
		});

		const all: StateMachineListItem[] = [];
		let nextToken: string | undefined;

		do {
			const result = await client.send(new ListStateMachinesCommand({ nextToken, maxResults: 100 }));
			all.push(...(result.stateMachines ?? []));
			nextToken = result.nextToken;
		} while (nextToken);

		return NextResponse.json({ stateMachines: all });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Step Function list error:', error);
		return NextResponse.json({ error: 'Failed to list state machines', details: errorMessage }, { status: 500 });
	}
}
