import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

export async function GET() {
	const globalPath = path.join(os.homedir(), '.claude', 'CLAUDE.md');
	const projectPath = path.join(process.cwd(), 'CLAUDE.md');

	const read = (p: string) => {
		try {
			return fs.readFileSync(p, 'utf-8');
		} catch {
			return null;
		}
	};

	return NextResponse.json({
		global: read(globalPath),
		project: read(projectPath),
	});
}

export async function PUT(request: NextRequest) {
	try {
		const { scope, content } = await request.json();

		const targetPath =
			scope === 'global'
				? path.join(os.homedir(), '.claude', 'CLAUDE.md')
				: path.join(process.cwd(), 'CLAUDE.md');

		fs.writeFileSync(targetPath, content, 'utf-8');
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
	}
}
