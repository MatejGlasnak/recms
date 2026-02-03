'use client'

import { useMemo } from 'react'
import { useResources } from './use-resources'
import type { ResourceProps } from '@refinedev/core'

/**
 * Hook to convert database resources to Refine resource definitions
 */
export function useRefineResources(): ResourceProps[] {
	const { data: dbResources = [] } = useResources()

	const refineResources = useMemo(() => {
		return dbResources.map(resource => ({
			name: resource.name,
			identifier: resource.id,
			meta: {
				label: resource.label,
				dataProviderName: 'external',
				endpoint: resource.endpoint,
				methods: resource.methods,
				dbResourceId: resource.id
			},
			list: `/admin/resources/${resource.name}`,
			create: `/admin/resources/${resource.name}/create`,
			edit: `/admin/resources/${resource.name}/edit/:id`,
			show: `/admin/resources/${resource.name}/show/:id`
		}))
	}, [dbResources])

	return refineResources
}
