'use client'

import { useParams } from 'next/navigation'
import { useList, useResourceParams } from '@refinedev/core'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { usePageSetup } from '@/lib/contexts/page-context'
import { useResources } from '@/lib/hooks/use-resources'
import { BlockRegistryProvider, useBlockRegistry } from '../../registry/BlockRegistry'
import { FieldRegistryProvider, useFieldRegistry } from '../../registry/FieldRegistry'
import { BlockRenderer } from '../../renderer'
import { PageLoading } from '../../ui/PageLoading'
import { PageError } from '../../ui/PageError'
import type { PageConfig } from '../../../types/block-config'
import { formatHeader } from '../../../utils'
import { usePageConfig, useUpdatePageConfig } from '../../../hooks/use-page-config'

// Import blocks
import { ListHeader, listHeaderConfig } from '../../blocks/list-header'
import { ListFilters, listFiltersConfig } from '../../blocks/list-filters'
import { ListTable, listTableConfig } from '../../blocks/list-table'
import { ListPagination, listPaginationConfig } from '../../blocks/list-pagination'
import { Grid, gridConfig } from '../../blocks/grid'

// Import filters
import { FilterInput, filterInputConfig } from '../../filters/filter-input'
import { FilterSelect, filterSelectConfig } from '../../filters/filter-select'
import { FilterCombobox, filterComboboxConfig } from '../../filters/filter-combobox'
import { FilterCheckbox, filterCheckboxConfig } from '../../filters/filter-checkbox'

// Import field types
import { registerAllFields } from '../../form/registerFields'

export interface ListPageContainerProps {
	resourceId?: string
}

function ListPageContent({ resourceId }: { resourceId: string }) {
	const { registerBlock } = useBlockRegistry()
	const { registerField } = useFieldRegistry()
	const [editMode, setEditMode] = useState(false)
	const [onEditModeToggle] = useState(() => () => setEditMode(prev => !prev))

	// Register field types
	useEffect(() => {
		registerAllFields(registerField)
	}, [registerField])

	// Register blocks
	useEffect(() => {
		registerBlock({
			slug: 'list-header',
			Component: ListHeader,
			config: listHeaderConfig,
			label: 'List Header'
		})
		registerBlock({
			slug: 'list-filters',
			Component: ListFilters,
			config: listFiltersConfig,
			label: 'List Filters'
		})
		registerBlock({
			slug: 'list-table',
			Component: ListTable,
			config: listTableConfig,
			label: 'List Table'
		})
		registerBlock({
			slug: 'list-pagination',
			Component: ListPagination,
			config: listPaginationConfig,
			label: 'List Pagination'
		})
		registerBlock({
			slug: 'grid',
			Component: Grid,
			config: gridConfig,
			label: 'Grid'
		})
		registerBlock({
			slug: 'filter-input',
			Component: FilterInput,
			config: filterInputConfig,
			label: 'Filter Input'
		})
		registerBlock({
			slug: 'filter-select',
			Component: FilterSelect,
			config: filterSelectConfig,
			label: 'Filter Select'
		})
		registerBlock({
			slug: 'filter-combobox',
			Component: FilterCombobox,
			config: filterComboboxConfig,
			label: 'Filter Combobox'
		})
		registerBlock({
			slug: 'filter-checkbox',
			Component: FilterCheckbox,
			config: filterCheckboxConfig,
			label: 'Filter Checkbox'
		})
		registerBlock({
			slug: 'table-filter',
			Component: FilterCheckbox,
			config: filterCheckboxConfig,
			label: 'Filter Checkbox'
		})
	}, [registerBlock])

	const { data: resources = [], isLoading: isResourcesLoading } = useResources()
	const resourceDef = useMemo(
		() => resources.find(r => r.name === resourceId),
		[resources, resourceId]
	)

	const { resource } = useResourceParams({ resource: resourceId })

	// Use resource definition (label/endpoint)
	const resourceLabel =
		resourceDef?.label ??
		(resource?.meta?.label as string) ??
		(isResourcesLoading ? 'Loading…' : formatHeader(resourceId))
	const isResourceLabelLoading = resourceLabel === 'Loading…'
	usePageSetup(resourceLabel, [
		{ label: 'Resources' },
		{ label: resourceLabel, muted: isResourceLabelLoading }
	])

	// Fetch page config from API
	const {
		data: apiPageConfig,
		isLoading: isPageConfigLoading,
		isError: isPageConfigError
	} = usePageConfig(resourceId)
	const updatePageConfig = useUpdatePageConfig(resourceId)

	// Merge API config with runtime props like onEditModeToggle
	const pageConfig: PageConfig | undefined = useMemo(() => {
		if (!apiPageConfig) return undefined

		// Clone and enhance blocks with runtime properties
		const enhancedBlocks = apiPageConfig.blocks.map(block => {
			if (block.slug === 'list-header') {
				return {
					...block,
					config: {
						...block.config,
						onEditModeToggle
					}
				}
			}
			return block
		})

		return {
			...apiPageConfig,
			blocks: enhancedBlocks
		}
	}, [apiPageConfig, onEditModeToggle])

	// Callback to update a specific block's config
	const handleBlockConfigUpdate = useCallback(
		async (blockId: string, newConfig: Record<string, unknown>) => {
			if (!pageConfig) return

			const updatedBlocks = pageConfig.blocks.map(block =>
				block.id === blockId ? { ...block, config: newConfig } : block
			)

			await updatePageConfig.mutateAsync({ blocks: updatedBlocks })
		},
		[pageConfig, updatePageConfig]
	)

	// State management for table functionality
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

	const listResult = useList({
		resource: resourceId,
		pagination: { current: currentPage, pageSize } as any,
		sorters: sorters as any,
		filters: filters as any,
		dataProviderName: 'external',
		meta: { endpoint: resourceDef?.endpoint ?? resource?.meta?.endpoint },
		queryOptions: {
			enabled: !!(resourceDef?.endpoint ?? resource?.meta?.endpoint)
		}
	})

	const { result, query } = listResult
	const data = useMemo(() => result.data ?? [], [result.data])
	const total = result.total ?? 0
	const isLoading = query.isLoading
	const isError = query.isError

	if (isResourcesLoading || isLoading || isPageConfigLoading) {
		const loadingMessage =
			isResourcesLoading || isPageConfigLoading ? 'Loading resources…' : 'Loading data…'

		return <PageLoading message={loadingMessage} />
	}

	if (isPageConfigError || !pageConfig) {
		return <PageError message='Failed to load page configuration' />
	}

	if (isError) {
		return <PageError error={query.error} message='Failed to load data' />
	}

	return (
		<div className='container mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
			{pageConfig.blocks
				.filter(block => block.visible !== false)
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
				.map(block => {
					// Prepare additional props based on block type
					let additionalProps: Record<string, unknown> = {}

					if (block.slug === 'list-filters') {
						additionalProps = {
							filterValues,
							onFilterChange: setFilterValues
						}
					} else if (block.slug === 'list-table') {
						additionalProps = {
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
						}
					} else if (block.slug === 'list-pagination') {
						additionalProps = {
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
						<BlockRenderer
							key={block.id}
							block={block}
							data={data}
							isLoading={isLoading}
							editMode={editMode}
							resourceId={resourceId}
							onConfigUpdate={handleBlockConfigUpdate}
							additionalProps={additionalProps}
						/>
					)
				})}
		</div>
	)
}

export function ListPage({ resourceId: resourceIdProp }: ListPageContainerProps) {
	const params = useParams()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''

	return (
		<BlockRegistryProvider>
			<FieldRegistryProvider>
				<ListPageContent resourceId={resourceId} />
			</FieldRegistryProvider>
		</BlockRegistryProvider>
	)
}
