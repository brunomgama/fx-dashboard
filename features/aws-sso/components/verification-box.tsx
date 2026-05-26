import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { AuthenticationComponent } from '../interface/sso-types';

export function VerificationBox({ currentProfile, verificationCode, ssoUrl, onCopy }: AuthenticationComponent) {
	return (
		<div className="space-y-3 rounded-lg border border-primary bg-primary/10 p-4">
			<p className="text-sm font-semibold">Authentication Required — {currentProfile}</p>

			{verificationCode && (
				<div>
					<p className="mb-1 text-xs text-muted-foreground">Verification Code</p>
					<div className="flex items-center gap-2">
						<code className="rounded border bg-background px-3 py-2 text-lg font-bold font-mono">{verificationCode}</code>
						<Button size="sm" variant="ghost" onClick={() => onCopy(verificationCode)}>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			<div>
				<p className="mb-1 text-xs text-muted-foreground">Authentication URL</p>
				<div className="flex items-start gap-2">
					<code className="flex-1 break-all rounded border bg-background px-2 py-1 text-xs">{ssoUrl}</code>
					<Button size="sm" variant="outline" onClick={() => onCopy(ssoUrl)}>
						<Copy className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
