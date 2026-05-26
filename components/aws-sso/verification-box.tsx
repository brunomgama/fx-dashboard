import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface VerificationBoxProps {
	currentProfile: string;
	ssoUrl: string;
	verificationCode: string;
}

export function VerificationBox({ currentProfile, ssoUrl, verificationCode }: VerificationBoxProps) {
	const handleCopy = (text: string) => {
		void navigator.clipboard.writeText(text);
	};

	return (
		<div className='space-y-3 rounded-lg border border-primary bg-primary/10 p-4'>
			<p className='font-montserrat text-sm font-semibold'>Authentication Required — {currentProfile}</p>

			{verificationCode && (
				<div>
					<p className='mb-1 font-montserrat text-xs font-light text-muted-foreground'>Verification Code</p>
					<div className='flex items-center gap-2'>
						<code className='rounded border bg-background px-3 py-2 font-mono text-lg font-bold'>{verificationCode}</code>
						<Button size='sm' variant='ghost' onClick={() => handleCopy(verificationCode)}>
							<Copy className='h-4 w-4' />
						</Button>
					</div>
				</div>
			)}

			<div>
				<p className='mb-1 font-montserrat text-xs font-light text-muted-foreground'>Authentication URL</p>
				<div className='flex items-start gap-2'>
					<code className='flex-1 break-all rounded border bg-background px-2 py-1 font-mono text-xs'>{ssoUrl}</code>
					<Button size='sm' variant='outline' onClick={() => handleCopy(ssoUrl)} className='font-montserrat font-semibold'>
						<Copy className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	);
}
