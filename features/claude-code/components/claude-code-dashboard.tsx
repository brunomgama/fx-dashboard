'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaudeMdEditor } from './claude-md-editor';
import { ContextVisualizer } from './context-visualizer';
import { MemoryManager } from './memory-manager';
import { SettingsInspector } from './settings-inspector';

export function ClaudeCodeDashboard() {
	return (
		<Tabs defaultValue='context'>
			<TabsList>
				<TabsTrigger value='context'>Context</TabsTrigger>
				<TabsTrigger value='memory'>Memory</TabsTrigger>
				<TabsTrigger value='claude-md'>CLAUDE.md</TabsTrigger>
				<TabsTrigger value='settings'>Settings</TabsTrigger>
			</TabsList>

			<TabsContent value='context' className='mt-6'>
				<ContextVisualizer />
			</TabsContent>

			<TabsContent value='memory' className='mt-6'>
				<MemoryManager />
			</TabsContent>

			<TabsContent value='claude-md' className='mt-6'>
				<ClaudeMdEditor />
			</TabsContent>

			<TabsContent value='settings' className='mt-6'>
				<SettingsInspector />
			</TabsContent>
		</Tabs>
	);
}
