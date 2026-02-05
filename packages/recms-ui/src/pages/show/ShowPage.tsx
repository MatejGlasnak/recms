'use client'

import { useParams } from 'next/navigation'
import { useOne } from '@refinedev/core'
import { useMemo } from 'react'
import { PageWrapper } from '../wrappers/PageWrapper'
import { useResources } from '@/lib/hooks/use-resources'
import { formatHeader } from '@blume/recms-core'

export interface ShowPageProps {
	resourceId?: string
	id?: string
}

/**
 * Simplified ShowPage component
 * Uses PageWrapper for rendering, only handles show-specific data fetching
 */
export function ShowPage({ resourceId: resourceIdProp, id: idProp }: ShowPageProps) {
	const params = useParams()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''
	const id = idProp ?? (params?.id as string) ?? ''

	// Resource metadata
	const { data: resources = [], isLoading: isResourcesLoading } = useResources()
	const resourceDef = useMemo(
		() => resources.find(r => r.name === resourceId),
		[resources, resourceId]
	)

	const resourceLabel =
		resourceDef?.label ?? (isResourcesLoading ? 'Loading…' : formatHeader(resourceId))

	// Fetch record data
	const { result, query } = useOne({
		resource: resourceId,
		id,
		dataProviderName: 'external',
		meta: { endpoint: resourceDef?.endpoint },
		queryOptions: {
			enabled: !!resourceDef?.endpoint
		}
	})

	const record = (result?.data as Record<string, unknown>) ?? null

	// Props map for blocks
	const additionalPropsMap = {
		'show-header': {
			resourceId,
			recordId: id,
			defaultTitle: `${resourceLabel} #${id}`,
			defaultDescription: `View details of this ${resourceLabel.toLowerCase()}.`
		},
		'show-content': {
			record
		},
		tabs: {
			record,
			disabled: true,
			readOnly: true
		},
		grid: {
			record,
			disabled: true,
			readOnly: true
		}
	}

	return (
		<PageWrapper
			pageType='show'
			resourceId={resourceId}
			recordId={id}
			data={record ? [record] : []}
			isLoading={query.isLoading || isResourcesLoading}
			isError={query.isError}
			error={query.error}
			additionalPropsMap={additionalPropsMap}
		/>
	)
}
