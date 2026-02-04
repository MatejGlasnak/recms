'use client'

import { useCallback, useMemo, useState } from 'react'
import { usePageConfig, useUpdatePageConfig } from '../../hooks/use-page-config'
import { BlockRenderer } from '../../ui/BlockRenderer'
import { PageLoading } from '../../ui/PageLoading'
import { PageError } from '../../ui/PageError'
import type { PageConfig } from '../../types/block-config'

export interface PageWrapperProps {
	pageType: 'list' | 'show' | 'edit' | 'create'
	resourceId: string
	recordId?: string
	data?: unknown[]
	isLoading?: boolean
	isError?: boolean
	error?: unknown
	additionalPropsMap?: Record<string, Record<string, unknown>>
	onEditModeToggle?: () => void
}

/**
 * Universal PageWrapper component
 * Handles page configuration, block rendering, and edit mode
 * Uses vertical layout with consistent spacing (gap-6)
 */
export function PageWrapper({
	pageType,
	resourceId,
	recordId,
	data = [],
	isLoading = false,
	isError = false,
	error,
	additionalPropsMap = {},
	onEditModeToggle
}: PageWrapperProps) {
	const [editMode, setEditMode] = useState(false)

	// Construct API path: list -> resourceId, show -> resourceId/show
	const configPath = pageType === 'show' ? `${resourceId}/show` : resourceId

	const {
		data: apiPageConfig,
		isLoading: isConfigLoading,
		isError: isConfigError
	} = usePageConfig(configPath)
	const updatePageConfig = useUpdatePageConfig(configPath)

	// Enhance config with runtime props
	const pageConfig: PageConfig | undefined = useMemo(() => {
		if (!apiPageConfig) return undefined

		const enhancedBlocks = apiPageConfig.blocks.map(block => {
			// Inject onEditModeToggle for header blocks
			if (block.slug === 'list-header' || block.slug === 'show-header') {
				return {
					...block,
					config: {
						...block.config,
						onEditModeToggle: () => setEditMode(prev => !prev)
					}
				}
			}
			return block
		})

		return { ...apiPageConfig, blocks: enhancedBlocks }
	}, [apiPageConfig])

	// Update block config
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

	// Loading and error states
	if (isLoading || isConfigLoading) {
		return <PageLoading message='Loading...' />
	}

	if (isError) {
		return <PageError error={error} message='Failed to load data' />
	}

	if (isConfigError || !pageConfig) {
		return <PageError message='Failed to load page configuration' />
	}

	// Vertical block layout (inspired by list-filters)
	return (
		<div className='container mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
			{pageConfig.blocks
				.filter(block => block.visible !== false)
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
				.map(block => (
					<BlockRenderer
						key={block.id}
						block={block}
						data={data}
						isLoading={isLoading}
						editMode={editMode}
						resourceId={resourceId}
						onConfigUpdate={handleBlockConfigUpdate}
						additionalProps={additionalPropsMap[block.slug] || {}}
					/>
				))}
		</div>
	)
}
