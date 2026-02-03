import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Resource, ResourceFormData } from '@/lib/types/resources'
import { toast } from 'sonner'

// Query keys
export const resourceKeys = {
	all: ['resources'] as const,
	list: () => [...resourceKeys.all, 'list'] as const,
	detail: (id: string) => [...resourceKeys.all, 'detail', id] as const
}

// API functions
async function fetchResources(): Promise<Resource[]> {
	const response = await fetch('/api/admin/config/resources')
	if (!response.ok) {
		throw new Error('Failed to fetch resources')
	}
	return response.json()
}

async function fetchResource(id: string): Promise<Resource> {
	const response = await fetch(`/api/admin/config/resources/${id}`)
	if (!response.ok) {
		throw new Error('Failed to fetch resource')
	}
	return response.json()
}

async function createResource(data: ResourceFormData): Promise<Resource> {
	const response = await fetch('/api/admin/config/resources', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Failed to create resource')
	}

	return response.json()
}

async function updateResource(id: string, data: ResourceFormData): Promise<Resource> {
	const response = await fetch(`/api/admin/config/resources/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error || 'Failed to update resource')
	}

	return response.json()
}

async function deleteResource(id: string): Promise<void> {
	const response = await fetch(`/api/admin/config/resources/${id}`, {
		method: 'DELETE'
	})

	if (!response.ok) {
		throw new Error('Failed to delete resource')
	}
}

// Hooks
export function useResources() {
	return useQuery({
		queryKey: resourceKeys.list(),
		queryFn: fetchResources
	})
}

export function useResource(id: string) {
	return useQuery({
		queryKey: resourceKeys.detail(id),
		queryFn: () => fetchResource(id),
		enabled: !!id && id !== 'new'
	})
}

export function useCreateResource() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createResource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: resourceKeys.list() })
			toast.success('Resource created successfully')
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to create resource')
		}
	})
}

export function useUpdateResource(id: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: ResourceFormData) => updateResource(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: resourceKeys.list() })
			queryClient.invalidateQueries({ queryKey: resourceKeys.detail(id) })
			toast.success('Resource updated successfully')
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to update resource')
		}
	})
}

export function useDeleteResource() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteResource,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: resourceKeys.list() })
			toast.success('Resource deleted successfully')
		},
		onError: (error: Error) => {
			toast.error(error.message || 'Failed to delete resource')
		}
	})
}
