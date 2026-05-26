'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../../../interface/wiki';
import { sendChatMessage } from '../api';

export function WikiChat() {
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	async function handleSubmit() {
		const question = input.trim();
		if (!question || loading) return;

		setInput('');
		setMessages((prev) => [...prev, { content: question, role: 'user' }]);
		setLoading(true);

		try {
			const { answer, pages_consulted } = await sendChatMessage({ question });
			setMessages((prev) => [
				...prev,
				{ content: answer, pagesConsulted: pages_consulted, role: 'assistant' },
			]);
		} catch {
			setMessages((prev) => [
				...prev,
				{ content: 'Something went wrong. Please try again.', role: 'assistant' },
			]);
		} finally {
			setLoading(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			void handleSubmit();
		}
	}

	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1 space-y-4 overflow-y-auto pb-4'>
				{messages.length === 0 ? (
					<div className='flex h-full items-center justify-center text-muted-foreground'>
						<p>Ask anything about your wiki</p>
					</div>
				) : (
					messages.map((msg, i) => (
						<div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
							<div
								className={cn(
									'max-w-[80%] rounded-2xl px-4 py-3',
									msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
								)}
							>
								<p className='whitespace-pre-wrap text-sm'>{msg.content}</p>
								{msg.pagesConsulted && msg.pagesConsulted.length > 0 && (
									<>
										<Separator className='my-2 opacity-20' />
										<p className='mb-1 text-xs text-muted-foreground'>Sources:</p>
										<div className='flex flex-wrap gap-1'>
											{msg.pagesConsulted.map((page) => (
												<Button key={page} variant='link' size='sm' className='h-auto p-0 text-xs' asChild>
													<a href={`/wiki?page=${encodeURIComponent(page)}`}>{page}</a>
												</Button>
											))}
										</div>
									</>
								)}
							</div>
						</div>
					))
				)}
				{loading && (
					<div className='flex justify-start'>
						<div className='rounded-2xl bg-muted px-4 py-3'>
							<div className='flex gap-1'>
								<span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]' />
								<span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]' />
								<span className='size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]' />
							</div>
						</div>
					</div>
				)}
				<div ref={bottomRef} />
			</div>
			<Separator className='mb-4' />
			<div className='flex gap-2'>
				<Textarea
					className='min-h-[60px] resize-none'
					disabled={loading}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder='Ask about your wiki...'
					value={input}
				/>
				<Button disabled={loading || !input.trim()} onClick={() => void handleSubmit()}>
					Send
				</Button>
			</div>
		</div>
	);
}
