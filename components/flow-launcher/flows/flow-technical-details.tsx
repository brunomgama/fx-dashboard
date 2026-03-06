'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Flow } from '@/types/flow-launcher';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface FlowTechnicalDetailsProps {
	flow: Flow;
}

export function FlowTechnicalDetails({ flow }: FlowTechnicalDetailsProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(flow.id);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className='space-y-3'>
			<h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wide'>Technical Details</h3>

			<div className='space-y-2 bg-muted/30 rounded-lg p-3'>
				<div>
					<div className='flex items-center justify-between'>
						<Label className='text-xs font-medium text-muted-foreground'>Flow ID</Label>
						<Button variant='ghost' size='sm' className='h-5 w-5 p-0 text-muted-foreground/50 hover:text-muted-foreground' onClick={handleCopy}>
							{copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
						</Button>
					</div>
					<p className='text-xs font-mono bg-background px-2 py-1.5 rounded mt-1 border break-all text-muted-foreground'>{flow.id}</p>
				</div>
				<div>
					<Label className='text-xs font-medium text-muted-foreground'>ARN</Label>
					<p className='text-xs font-mono bg-background px-2 py-1.5 rounded mt-1 border break-all text-muted-foreground'>{flow.arn}</p>
				</div>
			</div>
		</div>
	);
}
