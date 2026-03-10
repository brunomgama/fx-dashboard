'use client';

import { Button } from '@/components/ui/button';
import type { Task } from '@/features/organization/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
	tasks: Task[];
}

function toDateStr(d: Date) {
	return d.toISOString().split('T')[0];
}

export function MiniCalendar({ tasks }: Props) {
	const [year, setYear] = useState(() => new Date().getFullYear());
	const [month, setMonth] = useState(() => new Date().getMonth());

	const prevMonth = () => {
		if (month === 0) {
			setMonth(11);
			setYear((y) => y - 1);
		} else setMonth((m) => m - 1);
	};
	const nextMonth = () => {
		if (month === 11) {
			setMonth(0);
			setYear((y) => y + 1);
		} else setMonth((m) => m + 1);
	};

	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const padding = firstDay === 0 ? 6 : firstDay - 1;
	const todayStr = toDateStr(new Date());
	const monthLabel = new Date(year, month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

	// trailing cells to complete the last row
	const totalCells = padding + daysInMonth;
	const trailing = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

	const taskDayMap: Record<string, number> = {};
	tasks.forEach((t) => {
		if (!t.dueDate) return;
		const key = t.dueDate.split('T')[0];
		taskDayMap[key] = (taskDayMap[key] ?? 0) + 1;
	});

	return (
		<div>
			{/* Header */}
			<div className='mb-3 flex items-center justify-between'>
				<span className='text-sm font-semibold'>{monthLabel}</span>
				<div className='flex items-center gap-1'>
					<Button size='sm' variant='ghost' className='h-7 w-7 p-0' onClick={prevMonth}>
						<ChevronLeft className='h-3.5 w-3.5' />
					</Button>
					<Button
						size='sm'
						variant='ghost'
						className='h-7 px-2 text-xs'
						onClick={() => {
							setMonth(new Date().getMonth());
							setYear(new Date().getFullYear());
						}}>
						Today
					</Button>
					<Button size='sm' variant='ghost' className='h-7 w-7 p-0' onClick={nextMonth}>
						<ChevronRight className='h-3.5 w-3.5' />
					</Button>
					<Link href='/organization/calendar'>
						<Button size='sm' variant='outline' className='ml-2 h-7 px-2 text-xs'>
							Full view →
						</Button>
					</Link>
				</div>
			</div>

			{/* Weekday labels */}
			<div className='mb-1 grid grid-cols-7 text-center'>
				{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
					<div key={i} className={`py-1 text-[11px] font-medium ${i >= 5 ? 'text-red-400' : 'text-muted-foreground'}`}>
						{d}
					</div>
				))}
			</div>

			{/* Days grid */}
			<div className='grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-border'>
				{/* Leading padding */}
				{Array.from({ length: padding }).map((_, i) => (
					<div key={`pad-${i}`} className='bg-muted/30 py-2' />
				))}

				{/* Day cells */}
				{Array.from({ length: daysInMonth }).map((_, i) => {
					const day = i + 1;
					const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
					const isToday = dateStr === todayStr;
					const count = taskDayMap[dateStr] ?? 0;
					const isWeekend = new Date(dateStr + 'T00:00:00').getDay() === 0 || new Date(dateStr + 'T00:00:00').getDay() === 6;

					return (
						<Link key={dateStr} href='/organization/calendar'>
							<div className={`flex flex-col items-center py-2 transition-colors cursor-pointer ${isWeekend ? 'bg-muted/40 hover:bg-muted/60 dark:bg-white/5 dark:hover:bg-white/10' : 'bg-card hover:bg-muted/40'}`}>
								<span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? 'bg-red-500 text-white font-bold' : isWeekend ? 'text-red-400' : ''}`}>{day}</span>
								{/* Always render dot space — invisible when no tasks */}
								<span className={`mt-0.5 h-1 w-1 rounded-full ${count > 0 ? 'bg-blue-400' : 'bg-transparent'}`} />
							</div>
						</Link>
					);
				})}

				{/* Trailing padding to complete last row */}
				{Array.from({ length: trailing }).map((_, i) => (
					<div key={`trail-${i}`} className='bg-muted/30 py-2' />
				))}
			</div>
		</div>
	);
}
