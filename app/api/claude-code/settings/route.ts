import { NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

function readJson(filepath: string): unknown {
	try {
		return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
	} catch {
		return null;
	}
}

export async function GET() {
	const globalPath = path.join(os.homedir(), '.claude', 'settings.json');
	const projectLocalPath = path.join(process.cwd(), '.claude', 'settings.local.json');
	const projectPath = path.join(process.cwd(), '.claude', 'settings.json');

	return NextResponse.json({
		global: readJson(globalPath),
		project: readJson(projectPath) ?? readJson(projectLocalPath),
	});
}
