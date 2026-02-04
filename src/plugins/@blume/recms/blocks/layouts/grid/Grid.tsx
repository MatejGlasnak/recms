'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FormModal } from '../../../ui/FormModal'
import { gridConfig, getGridClasses } from './config'
import { useBlockRegistry, useFieldRegistry } from '../../../core/registries'
import type { BlockComponentProps } from '../../../core/registries/types'
import type { BlockConfig } from '../../../types/block-config'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Alert, AlertDescription } from '@/components/ui/alert'

function generateBlockId(): string {
	return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface NestedBlockConfig {
	id: string
	slug: string
	columnSpan?: number
	config: Record<string, unknown>
}

interface GridBlockConfig extends Record<string, unknown> {
	columns?: number
	columnsMobile?: number
	columnsTablet?: number
	columnsDesktop?: number
	blocks?: NestedBlockConfig[]
}

interface GridProps extends BlockComponentProps {
	allowedBlockTypes?: string[]
	fixedRegistryType?: boolean // If true, registryType cannot be changed
}

interface SortableBlockProps {
	block: NestedBlockConfig
	editMode?: boolean
	onClick: () => void
	children: React.ReactNode
}

function SortableBlock({ block, editMode, onClick, children }: SortableBlockProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: block.id
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	}

	if (!editMode) {
		return <div>{children}</div>
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className='relative cursor-move rounded-md border border-dashed border-primary/40 p-3 transition-colors hover:border-solid hover:border-primary'
			{...attributes}
			{...listeners}
		>
			<div
				onClick={e => {
					e.stopPropagation()
					onClick()
				}}
			>
				{children}
			</div>
		</div>
	)
}

export function Grid({
	blockConfig,
	editMode,
	onConfigUpdate,
	onDelete,
	allowedBlockTypes = [],
	fixedRegistryType = false,
	...additionalProps
}: GridProps) {
	const { getBlock } = useBlockRegistry()
	const { getField } = useFieldRegistry()
	const [showAddModal, setShowAddModal] = useState(false)
	const [showConfigModal, setShowConfigModal] = useState(false)
	const [editingBlockId, setEditingBlockId] = useState<string | null>(null)

	const config = blockConfig.config as GridBlockConfig
	const columnsMobile = config.columnsMobile ?? config.columns ?? 1
	const columnsTablet = config.columnsTablet ?? config.columns ?? 3
	const columnsDesktop = config.columnsDesktop ?? config.columns ?? 6
	const blocks = config.blocks ?? []

	// Generate Tailwind grid classes
	const gridClasses = getGridClasses(columnsMobile, columnsTablet, columnsDesktop)

	// Determine if we're working with fields or blocks
	const isFieldMode =
		allowedBlockTypes.length > 0 &&
		allowedBlockTypes.every(type => getField(type) !== undefined)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = blocks.findIndex(b => b.id === active.id)
			const newIndex = blocks.findIndex(b => b.id === over.id)

			if (oldIndex !== -1 && newIndex !== -1) {
				const newBlocks = arrayMove(blocks, oldIndex, newIndex)
				await onConfigUpdate?.(blockConfig.id, {
					...config,
					blocks: newBlocks
				})
			}
		}
	}

	const handleDeleteBlock = async (blockId: string) => {
		const newBlocks = blocks.filter(b => b.id !== blockId)
		await onConfigUpdate?.(blockConfig.id, {
			...config,
			blocks: newBlocks
		})
	}

	const handleAddBlock = async (values: Record<string, unknown>) => {
		const blockType = values.blockType as string

		// Extract blockType and columnSpan, rest goes to config
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { blockType: _blockType, columnSpan: _columnSpan, ...configFields } = values

		// For field mode, ensure we have field name
		if (isFieldMode && !configFields.field) {
			console.error('Field name is required for field mode')
			return
		}

		const newBlock: NestedBlockConfig = {
			id: generateBlockId(),
			slug: blockType,
			columnSpan: (values.columnSpan as number) ?? 1,
			config: configFields
		}

		await onConfigUpdate?.(blockConfig.id, {
			...config,
			blocks: [...blocks, newBlock]
		})
		setShowAddModal(false)
	}

	const handleUpdateNestedBlock = async (blockId: string, newConfig: Record<string, unknown>) => {
		const newBlocks = blocks.map(b => (b.id === blockId ? { ...b, config: newConfig } : b))
		await onConfigUpdate?.(blockConfig.id, {
			...config,
			blocks: newBlocks
		})
		setEditingBlockId(null)
	}

	const editingBlock = editingBlockId ? blocks.find(b => b.id === editingBlockId) : null
	const editingBlockDef = editingBlock ? getBlock(editingBlock.slug) : null
	const editingFieldDef = editingBlock ? getField(editingBlock.slug) : null

	// Build field editing config
	const fieldEditConfig =
		editingBlock && editingFieldDef
			? {
					fields: [
						{
							name: 'field',
							type: 'text' as const,
							label: 'Field Name',
							required: true,
							placeholder: 'e.g., title, description',
							comment: 'The field name from the record to display',
							span: 'full' as const
						},
						{
							name: 'label',
							type: 'text' as const,
							label: 'Label',
							placeholder: 'Optional label override',
							comment: 'Leave empty to use field name',
							span: 'full' as const
						},
						{
							name: 'columnSpan',
							type: 'number' as const,
							label: 'Column Span',
							default: 1,
							placeholder: '1',
							comment: `Span from 1 to ${columnsDesktop} columns`,
							span: 'full' as const
						}
					]
			  }
			: null

	// Build dynamic field config for add modal with all possible fields
	const addModalFieldConfig = {
		fields: [
			{
				name: 'blockType',
				type: 'dropdown' as const,
				label: isFieldMode ? 'Field Type' : 'Block Type',
				required: true,
				options: allowedBlockTypes.map(type => {
					if (isFieldMode) {
						const fieldDef = getField(type)
						return {
							label: fieldDef?.label ?? type,
							value: type
						}
					} else {
						const blockDef = getBlock(type)
						return {
							label: blockDef?.label ?? type,
							value: type
						}
					}
				}),
				span: 'full' as const
			},
			{
				name: 'columnSpan',
				type: 'number' as const,
				label: 'Column Span',
				default: 1,
				placeholder: '1',
				comment: `Span from 1 to ${columnsDesktop} columns`,
				span: 'full' as const
			},
			// Add field-specific config for field mode
			...(isFieldMode
				? [
						{
							name: 'field',
							type: 'text' as const,
							label: 'Field Name',
							required: true,
							placeholder: 'e.g., title, description',
							comment: 'The field name from the record to display',
							span: 'full' as const
						},
						{
							name: 'label',
							type: 'text' as const,
							label: 'Label',
							placeholder: 'Optional label override',
							comment: 'Leave empty to use field name',
							span: 'full' as const
						}
				  ]
				: []),
			// Add all possible fields from all allowed block types with triggers (for block mode)
			...(!isFieldMode
				? allowedBlockTypes.flatMap(type => {
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
				: [])
		]
	}

	const handleConfigUpdate = async (values: Record<string, unknown>) => {
		if (onConfigUpdate) {
			const updatedConfig = { ...config, ...values }

			// If registryType is fixed (e.g., when Grid is nested in Tabs),
			// preserve the existing registryType and don't let it be overwritten
			if (fixedRegistryType && config.registryType) {
				updatedConfig.registryType = config.registryType
			}

			await onConfigUpdate(blockConfig.id, updatedConfig)
		}
		// Modal will be closed by FormModal's handleSubmit
	}

	// Build grid config with conditional registryType field
	const dynamicGridConfig = {
		...gridConfig,
		fields: gridConfig.fields.filter(field => {
			// Hide registryType field if it's fixed (e.g., when Grid is nested in Tabs)
			// or if allowedBlockTypes is provided (predefined context)
			if (
				field.name === 'registryType' &&
				(fixedRegistryType || allowedBlockTypes.length > 0)
			) {
				return false
			}
			return true
		})
	}

	const handleDelete = async () => {
		if (onDelete && typeof onDelete === 'function') {
			await onDelete()
		}
	}

	return (
		<>
			<div
				className={`grid gap-4 ${gridClasses} ${
					editMode
						? 'cursor-pointer rounded-lg border border-dashed border-primary/40 p-3 hover:border-solid hover:border-primary [&:has(>*:hover)]:border-primary/40'
						: ''
				}`}
				onClick={e => {
					if (editMode) {
						// Only open config if clicking directly on the grid container, not on children
						if (e.target === e.currentTarget) {
							setShowConfigModal(true)
						}
					}
				}}
			>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={blocks.map(b => b.id)}
						strategy={verticalListSortingStrategy}
					>
						{blocks.map(block => {
							// Check if this is a field or a block
							const fieldDef = getField(block.slug)
							const blockDef = getBlock(block.slug)

							if (!fieldDef && !blockDef) {
								return (
									<div
										key={block.id}
										style={{ gridColumn: `span ${block.columnSpan ?? 1}` }}
									>
										<Alert variant='destructive'>
											<AlertDescription>
												Unknown {isFieldMode ? 'field' : 'block'} type:{' '}
												{block.slug}
											</AlertDescription>
										</Alert>
									</div>
								)
							}

							// Render field component
							if (fieldDef && isFieldMode) {
								const FieldComponent = fieldDef.Component
								const fieldName = block.config.field as string
								const fieldLabel = (block.config.label as string) || fieldName
								const recordValue = additionalProps.record
									? (additionalProps.record as Record<string, unknown>)[fieldName]
									: undefined

								const fieldConfig = {
									name: fieldName,
									label: fieldLabel,
									type: block.slug,
									disabled: true,
									readOnly: true
								}

								return (
									<div
										key={block.id}
										style={{ gridColumn: `span ${block.columnSpan ?? 1}` }}
									>
										<SortableBlock
											block={block}
											editMode={editMode}
											onClick={() => setEditingBlockId(block.id)}
										>
											<div className={editMode ? 'relative' : ''}>
												{/* Overlay in edit mode to prevent interaction */}
												{editMode && (
													<div
														className='absolute inset-0 z-10 cursor-pointer'
														onMouseDown={e => e.preventDefault()}
														onPointerDown={e => e.stopPropagation()}
													/>
												)}
												<FieldComponent
													field={fieldConfig as any}
													value={recordValue}
													onChange={() => {}} // No-op since it's disabled
													disabled={true}
													readOnly={true}
												/>
											</div>
										</SortableBlock>
									</div>
								)
							}

							// Render block component
							if (blockDef) {
								const BlockComponent = blockDef.Component
								const nestedBlockConfig: BlockConfig = {
									id: block.id,
									slug: block.slug,
									config: block.config
								}

								// Get filter value if this is a filter block
								const blockField = block.config.field as string | undefined
								const filterValueForBlock =
									blockField && additionalProps.filterValue
										? typeof additionalProps.filterValue === 'function'
											? additionalProps.filterValue(blockField)
											: additionalProps.filterValue
										: undefined

								// Check if this is a filter block
								const isFilterBlock = block.slug.startsWith('filter-')

								return (
									<div
										key={block.id}
										style={{ gridColumn: `span ${block.columnSpan ?? 1}` }}
									>
										<SortableBlock
											block={block}
											editMode={editMode}
											onClick={() => setEditingBlockId(block.id)}
										>
											<div
												className={
													isFilterBlock && editMode ? 'relative' : ''
												}
											>
												{/* Overlay for filter blocks in edit mode to prevent interaction */}
												{isFilterBlock && editMode && (
													<div
														className='absolute inset-0 z-10 cursor-pointer'
														onMouseDown={e => e.preventDefault()}
														onPointerDown={e => e.stopPropagation()}
													/>
												)}
												<BlockComponent
													blockConfig={nestedBlockConfig}
													editMode={false}
													onConfigUpdate={async (_, newConfig) =>
														handleUpdateNestedBlock(block.id, newConfig)
													}
													filterValue={filterValueForBlock}
													{...additionalProps}
												/>
											</div>
										</SortableBlock>
									</div>
								)
							}

							return null
						})}
					</SortableContext>
				</DndContext>

				{editMode && (
					<div
						className='group flex h-full w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-primary/60 opacity-50 transition-opacity hover:border-solid hover:border-primary hover:opacity-100'
						onClick={() => setShowAddModal(true)}
						style={{ gridColumn: `span ${Math.min(1, columnsDesktop)}` }}
					>
						<Plus className='size-8 font-extralight text-muted-foreground transition-colors group-hover:text-primary' />
					</div>
				)}
			</div>

			{/* Add Block/Field Modal */}
			<FormModal
				open={showAddModal}
				onOpenChange={setShowAddModal}
				title={isFieldMode ? 'Add Field' : 'Add Block'}
				description={
					isFieldMode ? 'Add a new field to the grid' : 'Add a new block to the grid'
				}
				fieldConfig={addModalFieldConfig}
				initialValues={{}}
				onSubmit={handleAddBlock}
			/>

			{/* Edit Nested Block Modal */}
			{editingBlock && editingBlockDef && !editingFieldDef && (
				<FormModal
					open={!!editingBlockId}
					onOpenChange={open => !open && setEditingBlockId(null)}
					title={`Edit ${editingBlockDef.label ?? editingBlock.slug}`}
					description={`Configure the ${
						editingBlockDef.label ?? editingBlock.slug
					} block`}
					fieldConfig={editingBlockDef.config}
					initialValues={editingBlock.config}
					onSubmit={async values => handleUpdateNestedBlock(editingBlock.id, values)}
					onDelete={async () => handleDeleteBlock(editingBlock.id)}
				/>
			)}

			{/* Edit Field Modal */}
			{editingBlock && editingFieldDef && fieldEditConfig && (
				<FormModal
					open={!!editingBlockId}
					onOpenChange={open => !open && setEditingBlockId(null)}
					title={`Edit ${editingFieldDef.label ?? editingBlock.slug} Field`}
					description={`Configure the field settings`}
					fieldConfig={fieldEditConfig}
					initialValues={editingBlock.config}
					onSubmit={async values => handleUpdateNestedBlock(editingBlock.id, values)}
					onDelete={async () => handleDeleteBlock(editingBlock.id)}
				/>
			)}

			{/* Grid Configuration Modal */}
			<FormModal
				open={showConfigModal}
				onOpenChange={setShowConfigModal}
				title='Configure Grid'
				description='Configure the grid layout settings'
				fieldConfig={dynamicGridConfig}
				initialValues={config}
				onSubmit={handleConfigUpdate}
				onDelete={onDelete ? handleDelete : undefined}
			/>
		</>
	)
}
