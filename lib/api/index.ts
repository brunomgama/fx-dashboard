/**
 * Unified API Layer
 *
 * Central export point for all API functionality
 */

export { BaseApiClient } from './base-api-client';
export type { ApiError, ApiResponse, BaseApiClientConfig, RequestConfig, RequestInterceptor, ResponseInterceptor, RetryConfig } from './base-api-client';

export { apiConfig, getEndpointUrl } from './config';
export type { ApiConfig, ApiEndpointConfig } from './config';

export { authInterceptor, environmentInterceptor, errorHandlerInterceptor, loggingInterceptor, performanceInterceptor, retryInterceptor } from './interceptors';

export { apiClient } from './client';
export type { Audience, AudienceType, AwsSsoLoginRequest, AwsSsoLoginResponse, AwsSsoStatus, Campaign, CampaignStatus, DescribeStateMachineResponse, EventConfig, FlowLauncherEvent, FlowLauncherFlow, ListParams, ListResponse, Sender, SESStatusResponse, Setting, StateMachine, StateMachineExecution, Template, TriggerEventRequest, TriggerEventResponse, Unsubscribe } from './client';

export { useApi, useAwsSsoApi, useEmailServiceApi, useFlowLauncherApi, useMutation, useQuery, useStepFunctionApi } from './hooks';
export type { UseApiCallOptions, UseApiCallReturn, UseApiCallState, UseMutationOptions, UseMutationReturn, UseQueryOptions, UseQueryReturn } from './hooks';
