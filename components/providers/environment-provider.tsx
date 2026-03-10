'use client';

import { DEFAULT_ENVIRONMENT, ENVIRONMENTS } from '@/lib/environment';
import { Environment, EnvironmentContextType } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
	const [environment, setEnvironmentState] = useState<Environment>(() => {
		if (typeof window === 'undefined') return DEFAULT_ENVIRONMENT;
		const saved = localStorage.getItem('selected-environment') as Environment;
		return saved && ENVIRONMENTS[saved] ? saved : DEFAULT_ENVIRONMENT;
	});

	const setEnvironment = (env: Environment) => {
		setEnvironmentState(env);
		localStorage.setItem('selected-environment', env);
	};

	return <EnvironmentContext.Provider value={{ environment, config: ENVIRONMENTS[environment], setEnvironment }}>{children}</EnvironmentContext.Provider>;
}

export function useEnvironment() {
	const context = useContext(EnvironmentContext);
	if (!context) throw new Error('useEnvironment must be used within EnvironmentProvider');
	return context;
}
