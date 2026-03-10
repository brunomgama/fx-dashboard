import { Cloud, CloudRain, CloudSnow, Loader2, Sun, Wind } from 'lucide-react';
import type { Weather } from './use-weather';

function getWeatherIcon(code: number) {
	if (code === 0) return <Sun className='h-8 w-8 text-yellow-400' />;
	if (code <= 3) return <Cloud className='h-8 w-8 text-gray-400' />;
	if (code >= 51 && code <= 67) return <CloudRain className='h-8 w-8 text-blue-400' />;
	if (code >= 71 && code <= 77) return <CloudSnow className='h-8 w-8 text-blue-200' />;
	if (code >= 80 && code <= 82) return <CloudRain className='h-8 w-8 text-blue-500' />;
	if (code >= 95) return <Wind className='h-8 w-8 text-gray-400' />;
	return <Cloud className='h-8 w-8 text-gray-400' />;
}

export function WeatherCard({ label, weather, loading }: { label: string; weather: Weather | null; loading: boolean }) {
	return (
		<div className='rounded-lg border bg-card p-6'>
			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>{label}</p>
			{loading ? (
				<div className='mt-4 flex items-center gap-2 text-muted-foreground'>
					<Loader2 className='h-5 w-5 animate-spin' />
					<span className='text-sm'>Loading...</span>
				</div>
			) : weather ? (
				<div className='mt-2 flex items-center gap-4'>
					{getWeatherIcon(weather.code)}
					<div>
						<p className='text-3xl font-bold'>{weather.temp}°C</p>
						<p className='text-sm text-muted-foreground'>{weather.description}</p>
					</div>
				</div>
			) : (
				<p className='mt-4 text-sm text-muted-foreground'>Weather unavailable</p>
			)}
		</div>
	);
}
