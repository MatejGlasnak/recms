'use client'

import { useParams } from 'next/navigation'
import { useList } from '@refinedev/core'
import { useMemo, useState } from 'react'
import { PageWrapper } from '../wrappers/PageWrapper'
import { useResources } from '@/lib/hooks/use-resources'
import { formatHeader } from '@blume/recms-core'

export interface ListPageProps {
	resourceId?: string
}

/**
 * Simplified ListPage component
 * Uses PageWrapper for rendering, only handles list-specific state and data fetching
 */
export function ListPage({ resourceId: resourceIdProp }: ListPageProps) {
	const params = useParams()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''

	// Resource metadata
	const { data: resources = [], isLoading: isResourcesLoading } = useResources()
	const resourceDef = useMemo(
		() => resources.find(r => r.name === resourceId),
		[resources, resourceId]
	)

	const resourceLabel =
		resourceDef?.label ?? (isResourcesLoading ? 'Loading…' : formatHeader(resourceId))

	// List state
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [sortField, setSortField] = useState<string>('')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})

	// Build filters from filter values
	const filters = useMemo(() => {
		const result: any[] = []
		Object.entries(filterValues).forEach(([key, value]) => {
			if (value !== null && value !== undefined && value !== '') {
				if (Array.isArray(value) && value.length === 0) return
				result.push({
					field: key,
					operator: 'contains',
					value
				})
			}
		})
		return result
	}, [filterValues])

	// Build sorters
	const sorters = useMemo(() => {
		if (!sortField) return []
		return [{ field: sortField, order: sortOrder }]
	}, [sortField, sortOrder])

	// Fetch list data
	const { result, query } = useList({
		resource: resourceId,
		pagination: { current: currentPage, pageSize } as any,
		sorters: sorters as any,
		filters: filters as any,
		dataProviderName: 'external',
		meta: { endpoint: resourceDef?.endpoint },
		queryOptions: {
			enabled: !!resourceDef?.endpoint
		}
	})

	const data = useMemo(() => result.data ?? [], [result.data])
	const total = result.total ?? 0

	// Props map for blocks
	const additionalPropsMap = {
		'list-header': {
			defaultTitle: resourceLabel
		},
		'list-filters': {
			filterValues,
			onFilterChange: setFilterValues
		},
		'list-table': {
			sortField,
			sortOrder,
			onSort: (field: string) => {
				if (sortField === field) {
					setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
				} else {
					setSortField(field)
					setSortOrder('asc')
				}
			}
		},
		'list-pagination': {
			currentPage,
			pageSize,
			total,
			onPageChange: setCurrentPage,
			onPageSizeChange: (newSize: number) => {
				setPageSize(newSize)
				setCurrentPage(1)
			}
		}
	}

	return (
		<PageWrapper
			pageType='list'
			resourceId={resourceId}
			data={data}
			isLoading={query.isLoading || isResourcesLoading}
			isError={query.isError}
			error={query.error}
			additionalPropsMap={additionalPropsMap}
		/>
	)
}
