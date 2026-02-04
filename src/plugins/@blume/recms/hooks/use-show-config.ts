import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ShowConfig } from '../types/show-config'

const DEFAULT_SHOW_CONFIG_API_BASE = '/api/admin/config/show'

export interface UseShowConfigOptions {
	configApiBaseUrl?: string
}

export function useShowConfig(resourceId: string, options?: UseShowConfigOptions) {
	const baseUrl = options?.configApiBaseUrl ?? DEFAULT_SHOW_CONFIG_API_BASE
	return useQuery({
		queryKey: ['show-config', resourceId],
		queryFn: async () => {
			const response = await fetch(`${baseUrl}/${resourceId}`)
			if (!response.ok) {
				throw new Error('Failed to fetch show config')
			}
			return response.json() as Promise<ShowConfig>
		},
		enabled: !!resourceId
	})
}

export function useUpdateShowConfig(resourceId: string, options?: UseShowConfigOptions) {
	const queryClient = useQueryClient()
	const baseUrl = options?.configApiBaseUrl ?? DEFAULT_SHOW_CONFIG_API_BASE

	return useMutation({
		mutationFn: async (data: Partial<ShowConfig>) => {
			const response = await fetch(`${baseUrl}/${resourceId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
			if (!response.ok) {
				throw new Error('Failed to update show config')
			}
			return response.json() as Promise<ShowConfig>
		},
		onSuccess: data => {
			queryClient.setQueryData(['show-config', resourceId], data)
		}
	})
}
