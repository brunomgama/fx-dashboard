'use client';

import { DEFAULT_ENVIRONMENT, ENVIRONMENTS } from '@/lib/environments';
import { Environment, EnvironmentConfig } from '@/types/flow-launcher';
import React, { createContext, useContext, useState } from 'react';

interface EnvironmentContextType {
	environment: Environment;
	setEnvironment: (env: Environment) => void;
	config: EnvironmentConfig;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
	const [environment, setEnvironmentState] = useState<Environment>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('selected-environment') as Environment;
			if (saved && ENVIRONMENTS[saved]) {
				return saved;
			}
		}
		return DEFAULT_ENVIRONMENT;
	});

	const setEnvironment = (env: Environment) => {
		setEnvironmentState(env);
		localStorage.setItem('selected-environment', env);
	};

	const config = ENVIRONMENTS[environment];

	return <EnvironmentContext.Provider value={{ environment, setEnvironment, config }}>{children}</EnvironmentContext.Provider>;
}

export function useEnvironment() {
	const context = useContext(EnvironmentContext);
	if (context === undefined) {
		throw new Error('useEnvironment must be used within an EnvironmentProvider');
	}
	return context;
}
