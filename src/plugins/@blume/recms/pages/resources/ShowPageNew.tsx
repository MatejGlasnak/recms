'use client'

import { useParams } from 'next/navigation'
import { useOne, useResourceParams } from '@refinedev/core'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { usePageSetup } from '@/lib/contexts/page-context'
import { useResources } from '@/lib/hooks/use-resources'
import { BlockRegistryProvider, useBlockRegistry } from '../../components/registry/BlockRegistry'
import { FieldRegistryProvider, useFieldRegistry } from '../../components/registry/FieldRegistry'
import { BlockRenderer } from '../../components/renderer'
import { PageLoading } from '../../components/ui/PageLoading'
import { PageError } from '../../components/ui/PageError'
import type { PageConfig } from '../../types/block-config'
import { formatHeader } from '../../utils'
import { usePageConfig, useUpdatePageConfig } from '../../hooks/use-page-config'

// Import blocks
import { ShowHeader, showHeaderConfig } from '../../components/blocks/show-header'
import { ShowContent, showContentConfig } from '../../components/blocks/show-content'
import { Grid, gridConfig } from '../../components/blocks/grid'
import { Tabs, tabsConfig } from '../../components/blocks/tabs'

// Import field types
import { registerAllFields } from '../../components/form/registerFields'

export interface ShowPageContainerProps {
	resourceId?: string
	id?: string
}

function ShowPageContent({ resourceId, id }: { resourceId: string; id: string }) {
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
			slug: 'show-header',
			Component: ShowHeader,
			config: showHeaderConfig,
			label: 'Show Header'
		})
		registerBlock({
			slug: 'show-content',
			Component: ShowContent,
			config: showContentConfig,
			label: 'Show Content'
		})
		registerBlock({
			slug: 'grid',
			Component: Grid,
			config: gridConfig,
			label: 'Grid'
		})
		registerBlock({
			slug: 'tabs',
			Component: Tabs,
			config: tabsConfig,
			label: 'Tabs'
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

	const pageTitle = `${resourceLabel}${id ? ` #${id}` : ''}`
	const pageDescription = `View details of this ${resourceLabel.toLowerCase()}.`

	usePageSetup(pageTitle, [
		{ label: 'Resources' },
		{ label: resourceLabel, href: `/admin/resources/${resourceId}` },
		...(id ? [{ label: `#${id}` }] : [])
	])

	// Fetch record data
	const { result, query } = useOne({
		resource: resourceId,
		id,
		dataProviderName: 'external',
		meta: { endpoint: resourceDef?.endpoint ?? resource?.meta?.endpoint },
		queryOptions: {
			enabled: !!(resourceDef?.endpoint ?? resource?.meta?.endpoint)
		}
	})

	const record = (result?.data as Record<string, unknown>) ?? null
	const isRecordLoading = query.isLoading
	const isRecordError = query.isError

	// Fetch page config from API (using show-specific endpoint)
	const {
		data: apiPageConfig,
		isLoading: isPageConfigLoading,
		isError: isPageConfigError
	} = usePageConfig(`${resourceId}/show`)
	const updatePageConfig = useUpdatePageConfig(`${resourceId}/show`)

	// Merge API config with runtime props
	const pageConfig: PageConfig | undefined = useMemo(() => {
		if (!apiPageConfig) return undefined

		// Clone and enhance blocks with runtime properties
		const enhancedBlocks = apiPageConfig.blocks.map(block => {
			if (block.slug === 'show-header') {
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

	if (isResourcesLoading || isRecordLoading || isPageConfigLoading) {
		const loadingMessage = isResourcesLoading
			? 'Loading resources…'
			: isPageConfigLoading
			? 'Loading page configuration…'
			: 'Loading data…'

		return <PageLoading message={loadingMessage} />
	}

	if (isPageConfigError || !pageConfig) {
		return <PageError message='Failed to load page configuration' />
	}

	if (isRecordError) {
		return <PageError error={query.error} message='Failed to load record' />
	}

	return (
		<div className='container mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
			{pageConfig.blocks
				.filter(block => block.visible !== false)
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
				.map(block => {
					// Prepare additional props based on block type
					let additionalProps: Record<string, unknown> = {}

					if (block.slug === 'show-header') {
						additionalProps = {
							resourceId,
							defaultTitle: pageTitle,
							defaultDescription: pageDescription,
							recordId: id
						}
					} else if (block.slug === 'show-content') {
						additionalProps = {
							record
						}
					}

					return (
						<BlockRenderer
							key={block.id}
							block={block}
							data={record ? [record] : []}
							isLoading={isRecordLoading}
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

export function ShowPageNew({ resourceId: resourceIdProp, id: idProp }: ShowPageContainerProps) {
	const params = useParams()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''
	const id = idProp ?? (params?.id as string) ?? ''

	return (
		<BlockRegistryProvider>
			<FieldRegistryProvider>
				<ShowPageContent resourceId={resourceId} id={id} />
			</FieldRegistryProvider>
		</BlockRegistryProvider>
	)
}
