import { NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

function readJson(filepath: string): Record<string, unknown> | null {
	try {
		return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
	} catch {
		return null;
	}
}

function safeReaddir(dir: string): string[] {
	try {
		return fs.readdirSync(dir);
	} catch {
		return [];
	}
}

export async function GET() {
	const claudeDir = path.join(os.homedir(), '.claude');
	const slug = process.cwd().replace(/[^a-zA-Z0-9]/g, '-');
	const projectDir = path.join(claudeDir, 'projects', slug);
	const memoryDir = path.join(projectDir, 'memory');
	const projectsDir = path.join(claudeDir, 'projects');

	const memoryByType: Record<string, number> = {};
	const memFiles = safeReaddir(memoryDir).filter((f) => f.endsWith('.md') && f !== 'MEMORY.md');

	for (const f of memFiles) {
		const content = fs.readFileSync(path.join(memoryDir, f), 'utf-8');
		const type = content.match(/^\s*type:\s*(.+)$/m)?.[1]?.trim() ?? 'unknown';
		memoryByType[type] = (memoryByType[type] ?? 0) + 1;
	}

	const globalSettings = readJson(path.join(claudeDir, 'settings.json'));
	const hooks = globalSettings?.hooks
		? Object.values(globalSettings.hooks as Record<string, unknown[]>).reduce((acc, arr) => acc + arr.length, 0)
		: 0;

	const projectSettings = readJson(path.join(process.cwd(), '.claude', 'settings.local.json'));
	const permissions = projectSettings?.permissions
		? [
				...((projectSettings.permissions as Record<string, string[]>)?.allow ?? []),
				...((projectSettings.permissions as Record<string, string[]>)?.deny ?? []),
			].length
		: 0;

	const allProjects = safeReaddir(projectsDir).filter((f) =>
		fs.statSync(path.join(projectsDir, f)).isDirectory(),
	);

	const conversations = safeReaddir(projectDir).filter((f) => f.endsWith('.jsonl')).length;

	return NextResponse.json({
		totalMemories: memFiles.length,
		memoryByType,
		hooks,
		permissions,
		projects: allProjects.length,
		conversations,
	});
}
