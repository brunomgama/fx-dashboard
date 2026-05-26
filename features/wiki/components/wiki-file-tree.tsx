'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { WikiFiles, WikiPageMeta } from '@/interface/wiki';
import { cn } from '@/lib/utils';

type Section = keyof WikiFiles;

const SECTIONS: { key: Section; label: string }[] = [
	{ key: 'sources', label: 'Sources' },
	{ key: 'entities', label: 'Entities' },
	{ key: 'concepts', label: 'Concepts' },
	{ key: 'synthesis', label: 'Synthesis' },
];

interface WikiFileTreeProps {
	files: WikiFiles;
	onSelect: (page: WikiPageMeta) => void;
	selectedPath: string | null;
}

export function WikiFileTree({ files, onSelect, selectedPath }: WikiFileTreeProps) {
	const sections = SECTIONS.filter(({ key }) => files[key].length > 0);

	return (
		<div className='space-y-1'>
			{sections.map(({ key, label }, index) => (
				<div key={key}>
					{index > 0 && <Separator className='my-3' />}
					<p className='mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						{label}
					</p>
					<ul>
						{files[key].map((page) => (
							<li key={page.path}>
								<Button
									variant='ghost'
									size='sm'
									className={cn('w-full justify-start font-normal', selectedPath === page.path && 'bg-accent font-medium')}
									onClick={() => onSelect(page)}
								>
									{page.title}
								</Button>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
