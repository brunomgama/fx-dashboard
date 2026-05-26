'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { WikiFileResponse } from '@/interface/wiki';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function processWikilinks(content: string): string {
	return content.replace(/\[\[([^\]]+)\]\]/g, (_, name: string) => `[${name}](wiki://${encodeURIComponent(name)})`);
}

interface WikiReaderProps {
	file: WikiFileResponse;
	onNavigate: (name: string) => void;
}

export function WikiReader({ file, onNavigate }: WikiReaderProps) {
	const processed = processWikilinks(file.content);
	const { frontmatter } = file;

	const dates = [
		frontmatter.updated && `Updated: ${frontmatter.updated}`,
		frontmatter.ingested && `Ingested: ${frontmatter.ingested}`,
		frontmatter['source-date'] && `Source: ${frontmatter['source-date']}`,
		frontmatter.created && `Created: ${frontmatter.created}`,
	].filter(Boolean);

	const components: Components = {
		a: ({ children, href }) => {
			if (href?.startsWith('wiki://')) {
				const name = decodeURIComponent(href.slice(7));
				return (
					<Button variant='link' size='sm' className='h-auto p-0' onClick={() => onNavigate(name)}>
						{children}
					</Button>
				);
			}
			return (
				<a className='text-primary underline' href={href} rel='noreferrer' target='_blank'>
					{children}
				</a>
			);
		},
	};

	return (
		<div className='mx-auto max-w-3xl'>
			<h1 className='mb-3 text-2xl font-bold'>{frontmatter.title}</h1>
			<div className='mb-4 rounded-lg border bg-muted/50 p-3 text-sm'>
				<div className='flex flex-wrap gap-1.5'>
					<span className='rounded bg-primary/10 px-2 py-0.5 font-medium capitalize text-primary'>
						{frontmatter.type}
						{frontmatter.subtype ? ` · ${frontmatter.subtype}` : ''}
					</span>
					{frontmatter.area && (
						<span className='rounded bg-secondary px-2 py-0.5 text-secondary-foreground'>{frontmatter.area}</span>
					)}
					{frontmatter.tags?.map((tag) => (
						<span key={tag} className='rounded bg-muted px-2 py-0.5 text-muted-foreground'>
							#{tag}
						</span>
					))}
				</div>
				{frontmatter.author && <p className='mt-2 text-muted-foreground'>By {frontmatter.author}</p>}
				{dates.length > 0 && <p className='mt-1 text-muted-foreground'>{dates.join(' · ')}</p>}
			</div>
			<Separator className='mb-6' />
			<div className='wiki-content'>
				<ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
					{processed}
				</ReactMarkdown>
			</div>
		</div>
	);
}
