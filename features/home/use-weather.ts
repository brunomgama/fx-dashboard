'use client';

import { useEffect, useState } from 'react';

export interface Weather {
	temp: number;
	description: string;
	code: number;
}

const CITIES = {
	brussels: { lat: 50.8503, lon: 4.3517 },
	lisbon: { lat: 38.7169, lon: -9.1395 },
};

function getWeatherDescription(code: number): string {
	if (code === 0) return 'Clear sky';
	if (code === 1) return 'Mainly clear';
	if (code === 2) return 'Partly cloudy';
	if (code === 3) return 'Overcast';
	if (code >= 51 && code <= 55) return 'Drizzle';
	if (code >= 61 && code <= 67) return 'Rain';
	if (code >= 71 && code <= 77) return 'Snow';
	if (code >= 80 && code <= 82) return 'Rain showers';
	if (code >= 95) return 'Thunderstorm';
	return 'Cloudy';
}

async function fetchCity(lat: number, lon: number): Promise<Weather> {
	const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
	const data = await res.json();
	const cw = data.current_weather;
	return { temp: Math.round(cw.temperature), code: cw.weathercode, description: getWeatherDescription(cw.weathercode) };
}

export function useWeather() {
	const [brussels, setBrussels] = useState<Weather | null>(null);
	const [lisbon, setLisbon] = useState<Weather | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const [b, l] = await Promise.all([fetchCity(CITIES.brussels.lat, CITIES.brussels.lon), fetchCity(CITIES.lisbon.lat, CITIES.lisbon.lon)]);
				setBrussels(b);
				setLisbon(l);
			} catch {
				setBrussels(null);
				setLisbon(null);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	return { brussels, lisbon, loading };
}
