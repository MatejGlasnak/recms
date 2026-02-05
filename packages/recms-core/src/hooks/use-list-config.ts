import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ListConfig } from '../types/list-config'

const DEFAULT_CONFIG_API_BASE = '/api/admin/config/lists'

export interface UseListConfigOptions {
	configApiBaseUrl?: string
}

export function useListConfig(resourceId: string, options?: UseListConfigOptions) {
	const baseUrl = options?.configApiBaseUrl ?? DEFAULT_CONFIG_API_BASE
	return useQuery({
		queryKey: ['list-config', resourceId],
		queryFn: async () => {
			const response = await fetch(`${baseUrl}/${resourceId}`)
			if (!response.ok) {
				throw new Error('Failed to fetch list config')
			}
			return response.json() as Promise<ListConfig>
		},
		enabled: !!resourceId
	})
}

export function useUpdateListConfig(resourceId: string, options?: UseListConfigOptions) {
	const queryClient = useQueryClient()
	const baseUrl = options?.configApiBaseUrl ?? DEFAULT_CONFIG_API_BASE

	return useMutation({
		mutationFn: async (data: Partial<ListConfig>) => {
			const response = await fetch(`${baseUrl}/${resourceId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				throw new Error('Failed to update list config')
			}

			return response.json() as Promise<ListConfig>
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['list-config', resourceId] })
		}
	})
}
