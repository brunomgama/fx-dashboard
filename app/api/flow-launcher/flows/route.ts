import { createFlow, listFlows } from '@/services/flow-launcher';
import type { Environment } from '@/types/environment';
import type { CreateFlowRequest } from '@/types/flow-launcher';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		return Response.json(await listFlows(environment));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to list flows' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		const data = (await request.json()) as CreateFlowRequest;
		return Response.json(await createFlow({ data, environment }));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to create flow' }, { status: 500 });
	}
}
