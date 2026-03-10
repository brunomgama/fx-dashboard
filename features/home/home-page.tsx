'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ClockCard } from './clock-card';
import { MiniCalendar } from './mini-calendar';
import { StatCards } from './stat-cards';
import { useHomeData } from './use-home-data';
import { useWeather } from './use-weather';
import { WeatherCard } from './weather-card';

export default function HomePage() {
	const { todos, tasks, pendingTodos, pendingTasks, todayTasks, overdueTasks } = useHomeData();
	const { brussels, lisbon, loading } = useWeather();

	return (
		<div className='flex min-h-screen flex-col'>
			<header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6'>
				<SidebarTrigger />
				<h1 className='text-xl font-semibold'>Home</h1>
			</header>

			<div className='flex-1 p-6'>
				<div className='flex gap-6'>
					{/* Left column */}
					<div className='flex flex-1 flex-col gap-4 min-w-0'>
						{/* Clock + weather */}
						<div className='grid grid-cols-3 gap-4'>
							<ClockCard />
							<WeatherCard label='Weather · Brussels' weather={brussels} loading={loading} />
							<WeatherCard label='Weather · Lisbon' weather={lisbon} loading={loading} />
						</div>

						{/* Stats */}
						<StatCards pendingTodos={pendingTodos} pendingTasks={pendingTasks} todayTasks={todayTasks} overdueTasks={overdueTasks} todos={todos} tasks={tasks} />
					</div>

					{/* Right column — calendar */}
					<div className='w-96 shrink-0'>
						<div className='rounded-lg border bg-card p-4'>
							<p className='mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground'>Calendar</p>
							<MiniCalendar tasks={tasks} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
