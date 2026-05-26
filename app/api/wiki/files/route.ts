import type { WikiPageMeta } from '@/interface/wiki';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

const VAULT_ROOT = process.env.WIKI_PATH ?? '/Users/bruno/Desktop/Obsidian/LLM_Wiki';

async function readDir(dir: string): Promise<WikiPageMeta[]> {
	const dirPath = path.join(VAULT_ROOT, dir);
	const files = await fs.readdir(dirPath).catch(() => [] as string[]);
	const pages: WikiPageMeta[] = [];
	for (const file of files) {
		if (!file.endsWith('.md')) continue;
		const raw = await fs.readFile(path.join(dirPath, file), 'utf-8');
		const { data } = matter(raw);
		const meta = data as Record<string, unknown>;
		pages.push({
			path: `${dir}/${file}`,
			tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
			title: typeof meta.title === 'string' ? meta.title : file.replace('.md', ''),
		});
	}
	return pages;
}

export async function GET() {
	const [sources, entities, concepts, synthesis] = await Promise.all([
		readDir('wiki/sources'),
		readDir('wiki/entities'),
		readDir('wiki/concepts'),
		readDir('wiki/synthesis'),
	]);
	return Response.json({ concepts, entities, sources, synthesis });
}
