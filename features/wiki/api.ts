import type { ChatResponse, WikiFileResponse, WikiFiles } from '../../interface/wiki';

export async function fetchWikiFiles(): Promise<WikiFiles> {
	const res = await fetch('/api/wiki/files');
	if (!res.ok) throw new Error('Failed to fetch wiki files');
	return res.json() as Promise<WikiFiles>;
}

export async function fetchWikiFile({ path }: { path: string }): Promise<WikiFileResponse> {
	const res = await fetch(`/api/wiki/file?path=${encodeURIComponent(path)}`);
	if (!res.ok) throw new Error('Failed to fetch wiki file');
	return res.json() as Promise<WikiFileResponse>;
}

export async function sendChatMessage({ question }: { question: string }): Promise<ChatResponse> {
	const res = await fetch('/api/wiki/chat', {
		body: JSON.stringify({ question }),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	});
	if (!res.ok) throw new Error('Chat request failed');
	return res.json() as Promise<ChatResponse>;
}
