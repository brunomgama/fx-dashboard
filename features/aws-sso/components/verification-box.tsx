import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';

interface VerificationBoxProps {
	currentProfile: string;
	verificationCode: string;
	ssoUrl: string;
	onCopy: (text: string) => void;
	onOpenBrowser: (url: string) => void;
}

export function VerificationBox({ currentProfile, verificationCode, ssoUrl, onCopy, onOpenBrowser }: VerificationBoxProps) {
	return (
		<div className='p-4 border border-primary rounded-lg bg-primary/10 space-y-3'>
			<div className='space-y-2'>
				<p className='text-sm font-semibold'>🔐 Authentication Required - {currentProfile}</p>

				{verificationCode && (
					<div>
						<p className='text-xs text-muted-foreground mb-1'>Verification Code:</p>
						<div className='flex items-center gap-2'>
							<code className='text-lg font-mono font-bold bg-background px-3 py-2 rounded border'>{verificationCode}</code>
							<Button size='sm' variant='ghost' onClick={() => onCopy(verificationCode)} title='Copy code'>
								<Copy className='h-4 w-4' />
							</Button>
						</div>
					</div>
				)}

				<div>
					<p className='text-xs text-muted-foreground mb-1'>Authentication URL (open in Arc browser):</p>
					<div className='flex items-start gap-2'>
						<code className='text-xs bg-background px-2 py-1 rounded border break-all flex-1'>{ssoUrl}</code>
						<Button size='sm' variant='ghost' onClick={() => onCopy(ssoUrl)} title='Copy URL'>
							<Copy className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>

			<div className='flex gap-2 pt-2'>
				<Button size='sm' onClick={() => onOpenBrowser(ssoUrl)} className='flex-1'>
					<ExternalLink className='mr-2 h-4 w-4' />
					Open in Browser
				</Button>
				<Button size='sm' variant='outline' onClick={() => onCopy(ssoUrl)}>
					<Copy className='mr-2 h-4 w-4' />
					Copy URL
				</Button>
			</div>

			<p className='text-xs text-muted-foreground pt-2 border-t'>💡 Tip: Open the URL in Arc, enter the verification code when prompted, and complete the AWS authentication.</p>
		</div>
	);
}
