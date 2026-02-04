'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { BlockComponentProps } from '../../registry/BlockRegistry'
import { EditableWrapper } from '../../ui/EditableWrapper'
import { ShowFieldValue } from '../../show/ShowFieldValue'
import { ConfigEmptyState } from '../../ui/ConfigEmptyState'
import { FormModal } from '../../form/FormModal'
import { useBlockRegistry } from '../../registry/BlockRegistry'
import type { ShowFieldConfig } from './types'
import type { ShowItem } from '../../../types/show-config'
import type { BlockConfig } from '../../../types'
import { showContentConfig } from './config'

export interface ShowContentConfig {
	columns?: string
	fields?: ShowFieldConfig[]
	showCard?: boolean
	cardTitle?: string
	cardDescription?: string
	blocks?: BlockConfig[]
	allowedBlockTypes?: string[]
}

export interface ShowContentProps extends BlockComponentProps {
	record?: Record<string, unknown> | null
}

export function ShowContent({
	blockConfig,
	editMode,
	record,
	onConfigUpdate,
	onDelete
}: ShowContentProps) {
	const config = blockConfig.config as ShowContentConfig
	const columns = Number(config.columns || 2)
	const fields = config.fields || []
	const blocks = config.blocks || []
	const showCard = config.showCard !== false
	const cardTitle = config.cardTitle
	const cardDescription = config.cardDescription
	const [showAddModal, setShowAddModal] = useState(false)
	const [showConfigModal, setShowConfigModal] = useState(false)

	const { blocks: registryBlocks, getBlock } = useBlockRegistry()

	// Get allowed block types (all except tabs to prevent deep nesting issues)
	const allowedBlockTypes =
		config.allowedBlockTypes ||
		Array.from(registryBlocks.keys()).filter(slug => slug !== 'tabs')

	// Build add block modal config
	const addModalFieldConfig = {
		fields: [
			{
				name: 'blockType',
				type: 'dropdown' as const,
				label: 'Block Type',
				required: true,
				options: allowedBlockTypes.map(type => {
					const blockDef = getBlock(type)
					return {
						label: blockDef?.label ?? type,
						value: type
					}
				}),
				span: 'full' as const
			},
			// Add all possible fields from all allowed block types with triggers
			...allowedBlockTypes.flatMap(type => {
				const blockDef = getBlock(type)
				if (!blockDef?.config?.fields) return []

				return blockDef.config.fields.map(field => ({
					...field,
					trigger: {
						action: 'show' as const,
						field: 'blockType',
						condition: `value[${type}]`
					}
				}))
			})
		]
	}

	const handleAddBlock = async (values: Record<string, unknown>) => {
		const blockType = values.blockType as string
		const blockDef = getBlock(blockType)
		if (!blockDef) return

		// Extract block-specific config
		const blockSpecificConfig: Record<string, unknown> = {}
		if (blockDef.config?.fields) {
			blockDef.config.fields.forEach(field => {
				if (values[field.name] !== undefined) {
					blockSpecificConfig[field.name] = values[field.name]
				}
			})
		}

		const newBlock: BlockConfig = {
			id: `block-${Date.now()}`,
			slug: blockType,
			config: blockSpecificConfig
		}

		const newBlocks = [...blocks, newBlock]
		await onConfigUpdate?.(blockConfig.id, {
			...config,
			blocks: newBlocks
		})
		setShowAddModal(false)
	}

	// Define handlers early so they're available in the empty state
	const handleConfigUpdate = async (values: Record<string, unknown>) => {
		if (onConfigUpdate) {
			await onConfigUpdate(blockConfig.id, { ...config, ...values })
		}
		setShowConfigModal(false)
	}

	const handleDelete = async () => {
		if (onDelete && typeof onDelete === 'function') {
			await onDelete()
		}
	}

	// Show empty state in edit mode when no fields and no blocks configured
	if (editMode && fields.length === 0 && blocks.length === 0) {
		return (
			<>
				<EditableWrapper editMode={true} onEditClick={() => setShowConfigModal(true)}>
					<ConfigEmptyState
						title='No content configured'
						description='Add blocks to display content in this section.'
						action={
							<Button
								onClick={e => {
									e.stopPropagation()
									setShowAddModal(true)
								}}
								size='sm'
							>
								<Plus className='h-4 w-4 mr-2' />
								Add Block
							</Button>
						}
					/>
				</EditableWrapper>

				{/* Add Block Modal */}
				<FormModal
					open={showAddModal}
					onOpenChange={setShowAddModal}
					title='Add Block'
					description='Add a new block to this section'
					fieldConfig={addModalFieldConfig}
					initialValues={{}}
					onSubmit={handleAddBlock}
				/>

				{/* Configuration Modal */}
				<FormModal
					open={showConfigModal}
					onOpenChange={setShowConfigModal}
					title='Configure Content'
					description='Configure the content section settings'
					fieldConfig={showContentConfig}
					initialValues={config as Record<string, unknown>}
					onSubmit={handleConfigUpdate}
					onDelete={onDelete ? handleDelete : undefined}
				/>
			</>
		)
	}

	// Don't render if no fields and no blocks configured and not in edit mode
	if (!editMode && fields.length === 0 && blocks.length === 0) {
		return null
	}

	const handleBlockConfigUpdate = async (blockId: string, newConfig: Record<string, unknown>) => {
		const updatedBlocks = blocks.map(block =>
			block.id === blockId ? { ...block, config: newConfig } : block
		)
		await onConfigUpdate?.(blockConfig.id, {
			...config,
			blocks: updatedBlocks
		})
	}

	const handleDeleteBlock = async (blockId: string) => {
		const newBlocks = blocks.filter(b => b.id !== blockId)
		await onConfigUpdate?.(blockConfig.id, {
			...config,
			blocks: newBlocks
		})
	}

	// Render blocks if any
	const blocksContent = blocks.length > 0 && (
		<div className='space-y-4'>
			{blocks.map(block => {
				const BlockComponent = getBlock(block.slug)?.Component
				if (!BlockComponent) return null

				return (
					<BlockComponent
						key={block.id}
						blockConfig={block}
						editMode={editMode}
						onConfigUpdate={(blockId, newConfig) =>
							handleBlockConfigUpdate(blockId, newConfig)
						}
						onDelete={() => handleDeleteBlock(block.id)}
						record={record}
					/>
				)
			})}
		</div>
	)

	// Render fields if any
	const fieldsContent = fields.length > 0 && (
		<div
			className='grid gap-6'
			style={{
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
			}}
		>
			{fields.map((field, index) => {
				const value = record ? record[field.field] : undefined
				const label = field.label || field.field
				const span = Math.min(columns, Math.max(1, field.colspan || 1))

				// Convert ShowFieldConfig to ShowItem for ShowFieldValue compatibility
				const showItem: ShowItem = {
					field: field.field,
					type: field.type as ShowItem['type'],
					label: field.label,
					colspan: field.colspan
				}

				return (
					<div
						key={field.id || `${field.field}-${index}`}
						className='grid gap-1.5 border-b border-border pb-4 last:border-0 last:pb-0'
						style={{ gridColumn: `span ${span}` }}
					>
						<dt className='text-sm font-medium text-muted-foreground'>{label}</dt>
						<dd className='text-sm'>
							<ShowFieldValue value={value} item={showItem} />
						</dd>
					</div>
				)
			})}
		</div>
	)

	// Combine fields and blocks content
	const combinedContent = (
		<>
			{fieldsContent}
			{blocksContent}
			{editMode && (blocks.length > 0 || fields.length > 0) && (
				<Button
					onClick={() => setShowAddModal(true)}
					variant='outline'
					size='sm'
					className='w-full'
				>
					<Plus className='h-4 w-4 mr-2' />
					Add Block
				</Button>
			)}
		</>
	)

	const wrappedContent = showCard ? (
		<Card>
			{(cardTitle || cardDescription) && (
				<CardHeader className='space-y-1.5'>
					{cardTitle && <CardTitle className='text-lg'>{cardTitle}</CardTitle>}
					{cardDescription && <CardDescription>{cardDescription}</CardDescription>}
				</CardHeader>
			)}
			<CardContent className={cardTitle || cardDescription ? '' : 'pt-6'}>
				{combinedContent}
			</CardContent>
		</Card>
	) : (
		combinedContent
	)

	return (
		<>
			<EditableWrapper
				editMode={editMode || false}
				onEditClick={() => editMode && setShowConfigModal(true)}
			>
				{wrappedContent}
			</EditableWrapper>

			{/* Add Block Modal */}
			<FormModal
				open={showAddModal}
				onOpenChange={setShowAddModal}
				title='Add Block'
				description='Add a new block to this section'
				fieldConfig={addModalFieldConfig}
				initialValues={{}}
				onSubmit={handleAddBlock}
			/>

			{/* Configuration Modal */}
			<FormModal
				open={showConfigModal}
				onOpenChange={setShowConfigModal}
				title='Configure Content'
				description='Configure the content section settings'
				fieldConfig={showContentConfig}
				initialValues={config as Record<string, unknown>}
				onSubmit={handleConfigUpdate}
				onDelete={onDelete ? handleDelete : undefined}
			/>
		</>
	)
}
