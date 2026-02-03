import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { SidebarConfig } from '@/lib/types/sidebar-config'
import { toast } from 'sonner'

// Query keys
export const sidebarConfigKeys = {
	all: ['sidebar-config'] as const,
	config: () => [...sidebarConfigKeys.all, 'config'] as const
}

// API functions
async function fetchSidebarConfig(): Promise<SidebarConfig> {
	const response = await fetch('/api/admin/config/sidebar')
	if (!response.ok) {
		throw new Error('Failed to fetch sidebar configuration')
	}
	return response.json()
}

async function updateSidebarConfig(data: SidebarConfig): Promise<SidebarConfig> {
	const response = await fetch('/api/admin/config/sidebar', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		throw new Error('Failed to save sidebar configuration')
	}

	return response.json()
}

// Hooks
export function useSidebarConfigQuery() {
	return useQuery({
		queryKey: sidebarConfigKeys.config(),
		queryFn: fetchSidebarConfig
	})
}

export function useUpdateSidebarConfig() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: updateSidebarConfig,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: sidebarConfigKeys.config() })
			toast.success('Sidebar configuration saved!')
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to save sidebar configuration')
		}
	})
}
