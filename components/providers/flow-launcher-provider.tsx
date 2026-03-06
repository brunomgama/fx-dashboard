'use client';

import { DEFAULT_ENVIRONMENT, FLOW_LAUNCHER_ENVIRONMENTS } from '@/lib/flow-launcher-environments';
import { FlowLauncherEnvironment } from '@/types/flow-launcher';
import React, { createContext, useContext, useState } from 'react';

interface FlowLauncherContextType {
	environment: FlowLauncherEnvironment;
	setEnvironment: (env: FlowLauncherEnvironment) => void;
	environmentConfig: (typeof FLOW_LAUNCHER_ENVIRONMENTS)[FlowLauncherEnvironment];
}

const FlowLauncherContext = createContext<FlowLauncherContextType | undefined>(undefined);

export function FlowLauncherProvider({ children }: { children: React.ReactNode }) {

	const [environment, setEnvironmentState] = useState<FlowLauncherEnvironment>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('flow-launcher-environment') as FlowLauncherEnvironment;
			if (saved && FLOW_LAUNCHER_ENVIRONMENTS[saved]) {
				return saved;
			}
		}
		return DEFAULT_ENVIRONMENT;
	});

	const setEnvironment = (env: FlowLauncherEnvironment) => {
		setEnvironmentState(env);
		localStorage.setItem('flow-launcher-environment', env);
	};

	const environmentConfig = FLOW_LAUNCHER_ENVIRONMENTS[environment];

	return <FlowLauncherContext.Provider value={{ environment, setEnvironment, environmentConfig }}>{children}</FlowLauncherContext.Provider>;
}

export function useFlowLauncher() {
	const context = useContext(FlowLauncherContext);
	if (context === undefined) {
		throw new Error('useFlowLauncher must be used within a FlowLauncherProvider');
	}
	return context;
}
