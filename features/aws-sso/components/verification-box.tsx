import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';

interface Props {
	currentProfile: string;
	verificationCode: string;
	ssoUrl: string;
	onCopy: (text: string) => void;
	onOpenBrowser: (url: string) => void;
}

export function VerificationBox({ currentProfile, verificationCode, ssoUrl, onCopy, onOpenBrowser }: Props) {
	return (
		<div className='space-y-3 rounded-lg border border-primary bg-primary/10 p-4'>
			<p className='text-sm font-semibold'>🔐 Authentication Required — {currentProfile}</p>

			{verificationCode && (
				<div>
					<p className='mb-1 text-xs text-muted-foreground'>Verification Code</p>
					<div className='flex items-center gap-2'>
						<code className='rounded border bg-background px-3 py-2 text-lg font-bold font-mono'>{verificationCode}</code>
						<Button size='sm' variant='ghost' onClick={() => onCopy(verificationCode)}>
							<Copy className='h-4 w-4' />
						</Button>
					</div>
				</div>
			)}

			<div>
				<p className='mb-1 text-xs text-muted-foreground'>Authentication URL</p>
				<div className='flex items-start gap-2'>
					<code className='flex-1 break-all rounded border bg-background px-2 py-1 text-xs'>{ssoUrl}</code>
					<Button size='sm' variant='ghost' onClick={() => onCopy(ssoUrl)}>
						<Copy className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<div className='flex gap-2 border-t pt-3'>
				<Button size='sm' onClick={() => onOpenBrowser(ssoUrl)} className='flex-1'>
					<ExternalLink className='mr-2 h-4 w-4' /> Open in Browser
				</Button>
				<Button size='sm' variant='outline' onClick={() => onCopy(ssoUrl)}>
					<Copy className='mr-2 h-4 w-4' /> Copy URL
				</Button>
			</div>
		</div>
	);
}
