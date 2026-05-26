import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

const VAULT_ROOT = process.env.WIKI_PATH ?? '/Users/bruno/Desktop/Obsidian/LLM_Wiki';
const client = new Anthropic();

export async function POST(request: Request) {
	const body = await request.json() as { question?: unknown };
	const question = typeof body.question === 'string' ? body.question.trim() : '';
	if (!question) return Response.json({ error: 'question is required' }, { status: 400 });

	const indexRaw = await fs.readFile(path.join(VAULT_ROOT, 'index.md'), 'utf-8').catch(() => '');

	const wikiDirs = ['wiki/sources', 'wiki/entities', 'wiki/concepts', 'wiki/synthesis'];
	const allPages: { content: string; path: string; title: string }[] = [];

	for (const dir of wikiDirs) {
		const dirPath = path.join(VAULT_ROOT, dir);
		const files = await fs.readdir(dirPath).catch(() => [] as string[]);
		for (const file of files) {
			if (!file.endsWith('.md')) continue;
			const raw = await fs.readFile(path.join(dirPath, file), 'utf-8');
			const { content, data } = matter(raw);
			const meta = data as Record<string, unknown>;
			allPages.push({
				content,
				path: `${dir}/${file}`,
				title: typeof meta.title === 'string' ? meta.title : file.replace('.md', ''),
			});
		}
	}

	const keywords = question.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
	const relevant = allPages
		.filter((page) =>
			keywords.some(
				(kw) => page.content.toLowerCase().includes(kw) || page.title.toLowerCase().includes(kw),
			),
		)
		.slice(0, 8);

	const wikiContext = relevant
		.map((p) => `### ${p.title} (${p.path})\n${p.content}`)
		.join('\n\n---\n\n');

	const response = await client.messages.create({
		max_tokens: 1024,
		messages: [{ content: question, role: 'user' }],
		model: 'claude-sonnet-4-6',
		system: `You are a knowledge assistant for a personal wiki. Answer questions using ONLY the wiki content provided below. Cite pages by name when referencing them. If the answer is not in the wiki, say so clearly.
		## Wiki Index ${indexRaw} ## Relevant Wiki Pages ${wikiContext}` });

	const answer = response.content.map((block) => (block.type === 'text' ? block.text : '')).join('');
	const pages_consulted = relevant.map((p) => p.title);

	return Response.json({ answer, pages_consulted });
}
