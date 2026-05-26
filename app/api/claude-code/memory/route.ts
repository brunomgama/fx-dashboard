import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

const getMemoryDir = () => {
	const slug = process.cwd().replace(/[^a-zA-Z0-9]/g, '-');
	return path.join(os.homedir(), '.claude', 'projects', slug, 'memory');
};

type MemoryEntry = {
	filename: string;
	name: string;
	description: string;
	type: string;
	body: string;
};

function parseMemoryFile(content: string, filename: string): MemoryEntry {
	const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) return { filename, name: filename, description: '', type: 'unknown', body: content };

	const frontmatter = match[1];
	const body = match[2].trim();

	const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? filename;
	const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '';
	const type = frontmatter.match(/^\s*type:\s*(.+)$/m)?.[1]?.trim() ?? 'unknown';

	return { filename, name, description, type, body };
}

export async function GET(request: NextRequest) {
	const memoryDir = getMemoryDir();
	const { searchParams } = new URL(request.url);
	const file = searchParams.get('file');

	try {
		if (!fs.existsSync(memoryDir)) {
			return NextResponse.json({ files: [], memoryIndex: null });
		}

		if (file) {
			const filepath = path.resolve(memoryDir, file);
			if (!filepath.startsWith(memoryDir)) {
				return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
			}
			const content = fs.readFileSync(filepath, 'utf-8');
			return NextResponse.json(parseMemoryFile(content, file));
		}

		const allFiles = fs.readdirSync(memoryDir);
		const mdFiles = allFiles.filter((f) => f.endsWith('.md') && f !== 'MEMORY.md');
		const memories = mdFiles.map((f) => {
			const content = fs.readFileSync(path.join(memoryDir, f), 'utf-8');
			return parseMemoryFile(content, f);
		});

		const memoryMdPath = path.join(memoryDir, 'MEMORY.md');
		const memoryIndex = fs.existsSync(memoryMdPath) ? fs.readFileSync(memoryMdPath, 'utf-8') : null;

		return NextResponse.json({ files: memories, memoryIndex });
	} catch {
		return NextResponse.json({ error: 'Failed to read memory files' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	const memoryDir = getMemoryDir();

	try {
		const { filename } = await request.json();
		const filepath = path.resolve(memoryDir, filename);

		if (!filepath.startsWith(memoryDir)) {
			return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
		}

		fs.unlinkSync(filepath);
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
	}
}
