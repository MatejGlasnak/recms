'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PageConfig } from '../types/block-config'

const API_BASE = '/api/admin/config'

export function usePageConfig(resourceId: string, options?: { enabled?: boolean }) {
	return useQuery<PageConfig>({
		queryKey: ['page-config', resourceId],
		queryFn: async () => {
			const response = await fetch(`${API_BASE}/pages/${resourceId}`)
			if (!response.ok) {
				throw new Error('Failed to fetch page config')
			}
			return response.json()
		},
		enabled: options?.enabled ?? true
	})
}

export function useUpdatePageConfig(
	resourceId: string,
	options?: {
		onSuccess?: (data: PageConfig) => void
		onError?: (error: Error) => void
	}
) {
	const queryClient = useQueryClient()

	return useMutation<PageConfig, Error, Partial<PageConfig>>({
		mutationFn: async (data: Partial<PageConfig>) => {
			const response = await fetch(`${API_BASE}/pages/${resourceId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				throw new Error('Failed to update page config')
			}

			return response.json()
		},
		onSuccess: data => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['page-config', resourceId] })
			options?.onSuccess?.(data)
		},
		onError: error => {
			options?.onError?.(error)
		}
	})
}
