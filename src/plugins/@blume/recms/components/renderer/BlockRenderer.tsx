'use client'

import { useBlockRegistry } from '../registry/BlockRegistry'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { BlockConfig } from '../../types/block-config'

export interface BlockRendererProps {
	block: BlockConfig
	data?: unknown[]
	isLoading?: boolean
	editMode?: boolean
	resourceId?: string
	onConfigUpdate?: (blockId: string, config: Record<string, unknown>) => Promise<void>
	additionalProps?: Record<string, unknown>
}

/**
 * BlockRenderer is a completely independent component that renders blocks
 * based on their configuration. It looks up the block component from the
 * BlockRegistry and passes all necessary props to it.
 */
export function BlockRenderer({
	block,
	data,
	isLoading,
	editMode,
	resourceId,
	onConfigUpdate,
	additionalProps
}: BlockRendererProps) {
	const { getBlock } = useBlockRegistry()
	const blockDef = getBlock(block.slug)

	if (!blockDef) {
		console.warn(`Block type "${block.slug}" not registered`)
		return (
			<Alert variant='destructive'>
				<AlertDescription className='text-sm'>
					Unknown block type: {block.slug}
				</AlertDescription>
			</Alert>
		)
	}

	const BlockComponent = blockDef.Component

	return (
		<BlockComponent
			blockConfig={block}
			data={data}
			isLoading={isLoading}
			editMode={editMode}
			resourceId={resourceId}
			onConfigUpdate={onConfigUpdate}
			{...additionalProps}
		/>
	)
}
