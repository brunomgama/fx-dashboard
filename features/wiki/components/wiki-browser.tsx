'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { WikiFileResponse, WikiFiles, WikiPageMeta } from '@/interface/wiki';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { fetchWikiFile, fetchWikiFiles } from '../api';
import { WikiFileTree } from './wiki-file-tree';
import { WikiReader } from './wiki-reader';

export function WikiBrowser() {
	const searchParams = useSearchParams();
	const initialPageRef = useRef(searchParams.get('page'));

	const [fileContent, setFileContent] = useState<WikiFileResponse | null>(null);
	const [files, setFiles] = useState<WikiFiles | null>(null);
	const [loadingContent, setLoadingContent] = useState(false);
	const [loadingFiles, setLoadingFiles] = useState(true);
	const [selectedPath, setSelectedPath] = useState<string | null>(null);

	useEffect(() => {
		fetchWikiFiles()
			.then((data) => {
				setFiles(data);
				const initialPage = initialPageRef.current;
				if (initialPage) {
					const all = [...data.sources, ...data.entities, ...data.concepts, ...data.synthesis];
					const match = all.find((p) => p.title === initialPage || p.path.endsWith(`${initialPage}.md`));
					if (match) {
						setSelectedPath(match.path);
						setLoadingContent(true);
						fetchWikiFile({ path: match.path })
							.then((content) => setFileContent(content))
							.finally(() => setLoadingContent(false));
					}
				}
			})
			.finally(() => setLoadingFiles(false));
	}, []);

	function selectPage(page: WikiPageMeta) {
		setSelectedPath(page.path);
		setLoadingContent(true);
		fetchWikiFile({ path: page.path })
			.then((data) => setFileContent(data))
			.finally(() => setLoadingContent(false));
	}

	function navigateToName(name: string) {
		if (!files) return;
		const all = [...files.sources, ...files.entities, ...files.concepts, ...files.synthesis];
		const match = all.find((p) => p.title === name || p.path.endsWith(`${name}.md`));
		if (match) selectPage(match);
	}

	return (
		<div className='flex h-full overflow-hidden'>
			<aside className='w-64 shrink-0 overflow-y-auto border-r p-4'>
				{loadingFiles ? (
					<div className='space-y-2'>
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton key={i} className='h-7 w-full' />
						))}
					</div>
				) : files ? (
					<WikiFileTree files={files} onSelect={selectPage} selectedPath={selectedPath} />
				) : (
					<p className='text-sm text-muted-foreground'>Failed to load wiki</p>
				)}
			</aside>
			<main className='flex-1 overflow-y-auto p-6'>
				{loadingContent ? (
					<div className='mx-auto max-w-3xl space-y-4'>
						<Skeleton className='h-8 w-2/3' />
						<Skeleton className='h-24 w-full' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-5/6' />
						<Skeleton className='h-4 w-4/6' />
					</div>
				) : fileContent ? (
					<WikiReader file={fileContent} onNavigate={navigateToName} />
				) : (
					<div className='flex h-full items-center justify-center text-muted-foreground'>
						<p>Select a page from the sidebar</p>
					</div>
				)}
			</main>
		</div>
	);
}
