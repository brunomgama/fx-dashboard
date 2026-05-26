import { Button } from '@/components/ui/button';

interface ErrorComponentProps {
	message: string;
	onRetry?: () => void;
}

export function ErrorComponent({ message, onRetry }: ErrorComponentProps) {
	return (
		<div className='flex h-64 flex-col items-center justify-center gap-4'>
			<p className='font-montserrat font-light text-destructive'>{message}</p>
			{onRetry && (
				<Button onClick={onRetry} className='font-montserrat font-semibold'>
					Retry
				</Button>
			)}
		</div>
	);
}
