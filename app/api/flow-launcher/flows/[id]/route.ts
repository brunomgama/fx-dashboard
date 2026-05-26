import { deleteFlow, getFlow, updateFlow } from '@/services/flow-launcher';
import type { Environment } from '@/types/environment';
import type { UpdateFlowRequest } from '@/types/flow-launcher';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		return Response.json(await getFlow({ environment, id }));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to get flow' }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		const data = (await request.json()) as UpdateFlowRequest;
		return Response.json(await updateFlow({ data, environment, id }));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to update flow' }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const environment = searchParams.get('environment') as Environment;

	if (!environment) {
		return Response.json({ error: 'environment is required' }, { status: 400 });
	}

	try {
		return Response.json(await deleteFlow({ environment, id }));
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : 'Failed to delete flow' }, { status: 500 });
	}
}
