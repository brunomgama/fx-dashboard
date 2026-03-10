'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import type { Flow } from '../../types';

export function FlowTechnicalDetails({ flow }: { flow: Flow }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(flow.id);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className='space-y-3'>
			<h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>Technical Details</h3>
			<div className='space-y-2 rounded-lg bg-muted/30 p-3'>
				<div>
					<div className='flex items-center justify-between'>
						<Label className='text-xs text-muted-foreground'>Flow ID</Label>
						<Button variant='ghost' size='sm' className='h-5 w-5 p-0 text-muted-foreground/50 hover:text-muted-foreground' onClick={handleCopy}>
							{copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
						</Button>
					</div>
					<p className='mt-1 break-all rounded border bg-background px-2 py-1.5 font-mono text-xs text-muted-foreground'>{flow.id}</p>
				</div>
				<div>
					<Label className='text-xs text-muted-foreground'>ARN</Label>
					<p className='mt-1 break-all rounded border bg-background px-2 py-1.5 font-mono text-xs text-muted-foreground'>{flow.arn}</p>
				</div>
			</div>
		</div>
	);
}
