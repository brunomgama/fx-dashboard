/**
 * API Hooks
 *
 * React hooks for making API calls with loading states and error handling
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { apiClient } from './client';

export interface UseApiCallOptions<T> {
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
	initialData?: T;
}

export interface UseApiCallState<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
}

export interface UseApiCallReturn<T, TArgs extends unknown[]> extends UseApiCallState<T> {
	execute: (...args: TArgs) => Promise<T | null>;
	reset: () => void;
}

/**
 * Generic hook for API calls
 */
export function useApiCall<T, TArgs extends unknown[] = []>(apiFunction: (...args: TArgs) => Promise<T>, options?: UseApiCallOptions<T>): UseApiCallReturn<T, TArgs> {
	const [state, setState] = useState<UseApiCallState<T>>({
		data: options?.initialData || null,
		loading: false,
		error: null,
	});

	const execute = useCallback(
		async (...args: TArgs): Promise<T | null> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			try {
				const result = await apiFunction(...args);
				setState({ data: result, loading: false, error: null });
				options?.onSuccess?.(result);
				return result;
			} catch (error) {
				const errorObj = error instanceof Error ? error : new Error('An error occurred');
				setState((prev) => ({ ...prev, loading: false, error: errorObj }));
				options?.onError?.(errorObj);
				return null;
			}
		},
		[apiFunction, options]
	);

	const reset = useCallback(() => {
		setState({
			data: options?.initialData || null,
			loading: false,
			error: null,
		});
	}, [options?.initialData]);

	return {
		...state,
		execute,
		reset,
	};
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export interface UseMutationOptions<TData, TVariables> {
	onSuccess?: (data: TData, variables: TVariables) => void;
	onError?: (error: Error, variables: TVariables) => void;
}

export interface UseMutationReturn<TData, TVariables> {
	mutate: (variables: TVariables) => Promise<TData | null>;
	data: TData | null;
	loading: boolean;
	error: Error | null;
	reset: () => void;
}

export function useMutation<TData, TVariables = void>(mutationFn: (variables: TVariables) => Promise<TData>, options?: UseMutationOptions<TData, TVariables>): UseMutationReturn<TData, TVariables> {
	const [state, setState] = useState<UseApiCallState<TData>>({
		data: null,
		loading: false,
		error: null,
	});

	const mutate = useCallback(
		async (variables: TVariables): Promise<TData | null> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));

			try {
				const result = await mutationFn(variables);
				setState({ data: result, loading: false, error: null });
				options?.onSuccess?.(result, variables);
				return result;
			} catch (error) {
				const errorObj = error instanceof Error ? error : new Error('An error occurred');
				setState((prev) => ({ ...prev, loading: false, error: errorObj }));
				options?.onError?.(errorObj, variables);
				return null;
			}
		},
		[mutationFn, options]
	);

	const reset = useCallback(() => {
		setState({
			data: null,
			loading: false,
			error: null,
		});
	}, []);

	return {
		mutate,
		...state,
		reset,
	};
}

/**
 * Hook for queries with auto-fetch on mount
 */
export interface UseQueryOptions<T> extends UseApiCallOptions<T> {
	enabled?: boolean;
	refetchInterval?: number;
}

export interface UseQueryReturn<T> extends UseApiCallState<T> {
	refetch: () => Promise<T | null>;
}

export function useQuery<T>(queryFn: () => Promise<T>, options?: UseQueryOptions<T>): UseQueryReturn<T> {
	const [state, setState] = useState<UseApiCallState<T>>({
		data: options?.initialData || null,
		loading: options?.enabled !== false,
		error: null,
	});

	const refetch = useCallback(async (): Promise<T | null> => {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		try {
			const result = await queryFn();
			setState({ data: result, loading: false, error: null });
			options?.onSuccess?.(result);
			return result;
		} catch (error) {
			const errorObj = error instanceof Error ? error : new Error('An error occurred');
			setState((prev) => ({ ...prev, loading: false, error: errorObj }));
			options?.onError?.(errorObj);
			return null;
		}
	}, [queryFn, options]);

	// Auto-fetch on mount
	useState(() => {
		if (options?.enabled !== false) {
			refetch();
		}

		// Set up refetch interval if specified
		if (options?.refetchInterval && options?.refetchInterval > 0) {
			const interval = setInterval(refetch, options.refetchInterval);
			return () => clearInterval(interval);
		}
	});

	return {
		...state,
		refetch,
	};
}

/**
 * Unified API Hook
 *
 * Returns the API client pre-configured with the current environment.
 * This hook automatically handles environment switching and configuration.
 *
 * Usage:
 * const api = useApi();
 * const campaigns = await api.emailService.listCampaigns({ limit: 10 });
 * const flows = await api.flowLauncher.listFlows();
 */
export function useApi() {
	// Return the singleton API client
	// The environment configuration is handled by interceptors
	return useMemo(() => apiClient, []);
}

/**
 * Convenience hooks for specific services
 */
export function useEmailServiceApi() {
	const api = useApi();
	return useMemo(() => api.emailService, [api]);
}

export function useFlowLauncherApi() {
	const api = useApi();
	return useMemo(() => api.flowLauncher, [api]);
}

export function useStepFunctionApi() {
	const api = useApi();
	return useMemo(() => api.stepFunction, [api]);
}

export function useAwsSsoApi() {
	const api = useApi();
	return useMemo(() => api.awsSso, [api]);
}
