import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const VAULT_ROOT = process.env.WIKI_PATH ?? '/Users/bruno/Desktop/Obsidian/LLM_Wiki';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const filePath = searchParams.get('path');
	if (!filePath) return Response.json({ error: 'path is required' }, { status: 400 });

	const fullPath = path.join(VAULT_ROOT, filePath);
	if (!fullPath.startsWith(VAULT_ROOT)) {
		return Response.json({ error: 'invalid path' }, { status: 400 });
	}

	const raw = await fs.readFile(fullPath, 'utf-8').catch(() => null);
	if (!raw) return Response.json({ error: 'file not found' }, { status: 404 });

	const { content, data: frontmatter } = matter(raw);
	return Response.json({ content, frontmatter });
}
