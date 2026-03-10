'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '../../types';

interface Props {
	tasks: Task[];
	selectedDate: string;
	onSelectDate: (date: string) => void;
}

function toDateStr(date: Date): string {
	return date.toISOString().split('T')[0];
}

function today(): string {
	return toDateStr(new Date());
}

export function CalendarGrid({ tasks, selectedDate, onSelectDate }: Props) {
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
	const paddingDays = firstDay === 0 ? 6 : firstDay - 1;

	const taskDayMap: Record<string, Task[]> = {};
	tasks.forEach((task) => {
		if (!task.dueDate) return;
		const key = task.dueDate.split('T')[0];
		if (!taskDayMap[key]) taskDayMap[key] = [];
		taskDayMap[key].push(task);
	});

	const monthLabel = new Date(year, month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
	const todayStr = today();

	return (
		<div className='flex h-full flex-col rounded-lg border bg-card'>
			{/* Header */}
			<div className='flex items-center justify-between border-b px-6 py-4'>
				<h2 className='text-lg font-semibold'>{monthLabel}</h2>
				<div className='flex gap-1'>
					<Button size='sm' variant='ghost' className='h-8 w-8 p-0' onClick={prevMonth}>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<Button
						size='sm'
						variant='outline'
						className='h-8 px-3 text-xs'
						onClick={() => {
							setMonth(new Date().getMonth());
							setYear(new Date().getFullYear());
							onSelectDate(todayStr);
						}}>
						Today
					</Button>
					<Button size='sm' variant='ghost' className='h-8 w-8 p-0' onClick={nextMonth}>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</div>

			{/* Weekday labels */}
			<div className='grid grid-cols-7 border-b'>
				{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
					<div key={d} className={`py-2 text-center text-xs font-medium ${i >= 5 ? 'text-red-400' : 'text-muted-foreground'}`}>
						{d}
					</div>
				))}
			</div>

			{/* Days grid — restore bg-border for the gap color */}
			<div className='grid flex-1 grid-cols-7 grid-rows-6 gap-px bg-border'>
				{/* Padding cells */}
				{Array.from({ length: paddingDays }).map((_, i) => (
					<div key={`pad-${i}`} className='bg-muted/30' />
				))}

				{/* Day cells */}
				{Array.from({ length: daysInMonth }).map((_, i) => {
					const day = i + 1;
					const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
					const dayTasks = taskDayMap[dateStr] ?? [];
					const isToday = dateStr === todayStr;
					const isSelected = dateStr === selectedDate;
					const isWeekend = new Date(dateStr + 'T00:00:00').getDay() === 0 || new Date(dateStr + 'T00:00:00').getDay() === 6;
					const hasOverdue = dayTasks.some((t) => !t.completed && dateStr < todayStr);

					return (
						<Button key={dateStr} variant='ghost' onClick={() => onSelectDate(dateStr)} className={`relative flex h-full w-full flex-col items-start justify-start rounded-none p-2 text-left transition-colors ${isSelected ? 'ring-2 ring-inset ring-red-400' : ''} ${isWeekend ? 'bg-muted/60 hover:bg-muted/80 dark:bg-white/5 dark:hover:bg-white/10' : 'bg-card hover:bg-muted/40 dark:bg-card dark:hover:bg-white/5'}`}>
							<span
								className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold
								${isToday ? 'bg-red-300 text-gray-700' : ''}
								${isSelected && !isToday ? 'text-red-600 dark:text-red-400' : ''}
								${isWeekend && !isToday ? 'text-red-400' : ''}`}>
								{day}
							</span>

							{dayTasks.length > 0 && (
								<div className='mt-1 flex items-center gap-1'>
									<span className={`h-2 w-2 shrink-0 rounded-full mr-2 ${dayTasks[0].completed ? 'bg-muted-foreground' : hasOverdue && dateStr < todayStr ? 'bg-red-400' : 'bg-blue-400'}`} />
									<p className='truncate text-[1rem] text-muted-foreground'>{dayTasks.length === 1 ? dayTasks[0].title : `${dayTasks.length} tasks`}</p>
								</div>
							)}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
