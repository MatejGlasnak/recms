import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ListConfig } from '@/lib/types/list-config'

export function useListConfig(resourceId: string) {
	return useQuery({
		queryKey: ['list-config', resourceId],
		queryFn: async () => {
			const response = await fetch(`/api/admin/config/lists/${resourceId}`)
			if (!response.ok) {
				throw new Error('Failed to fetch list config')
			}
			return response.json() as Promise<ListConfig>
		},
		enabled: !!resourceId
	})
}

export function useUpdateListConfig(resourceId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: Partial<ListConfig>) => {
			const response = await fetch(`/api/admin/config/lists/${resourceId}`, {
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
