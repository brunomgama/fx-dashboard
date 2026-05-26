import { createEvent, listEvents } from '@/services/flow-launcher';
import type { Environment } from '@/types/environment';
import type { CreateEventRequest } from '@/types/flow-launcher';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		return Response.json(await listEvents(environment));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to list events' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		const data = (await request.json()) as CreateEventRequest;
		return Response.json(await createEvent({ data, environment }));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to create event' }, { status: 500 });
	}
}
