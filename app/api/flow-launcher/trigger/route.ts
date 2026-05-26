import { triggerEvent } from '@/services/flow-launcher';
import type { Environment } from '@/types/environment';
import type { TriggerEventRequest } from '@/types/flow-launcher';

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		const data = (await request.json()) as TriggerEventRequest;
		return Response.json(await triggerEvent({ data, environment }));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to trigger event' }, { status: 500 });
	}
}
