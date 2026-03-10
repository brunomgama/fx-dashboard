'use client';

import { useEffect, useState } from 'react';

export function ClockCard() {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const id = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
	const timeLabel = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

	return (
		<div className='rounded-lg border bg-card p-6'>
			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Today</p>
			<p className='mt-1 text-2xl font-bold'>{dateLabel}</p>
			<p className='mt-1 font-mono text-3xl font-semibold tabular-nums text-muted-foreground'>{timeLabel}</p>
		</div>
	);
}
