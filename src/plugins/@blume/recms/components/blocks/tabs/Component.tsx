'use client'

import { useState } from 'react'
import { Tabs as TabsUI, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import type { BlockComponentProps } from '../../registry/BlockRegistry'
import { useBlockRegistry } from '../../registry/BlockRegistry'
import { EditableWrapper } from '../../ui/EditableWrapper'
import { BlockRenderer } from '../../renderer'
import { FormModal } from '../../form/FormModal'
import { ConfigEmptyState } from '../../ui/ConfigEmptyState'
import type { TabsConfig, TabItem } from './types'
import type { BlockConfig } from '../../../types'

export interface TabsProps extends BlockComponentProps {
	record?: Record<string, unknown> | null
}

export function Tabs({ blockConfig, editMode, record, onConfigUpdate, onDelete }: TabsProps) {
	const config = blockConfig.config as TabsConfig
	const tabs = config.tabs || []
	const defaultTab = config.defaultTab || tabs[0]?.id
	const orientation = config.orientation || 'horizontal'
	const variant = config.variant || 'default'

	const [activeTab, setActiveTab] = useState(defaultTab)
	const [showAddModal, setShowAddModal] = useState(false)
	const [currentTabForAdd, setCurrentTabForAdd] = useState<string | null>(null)
	const [showConfigModal, setShowConfigModal] = useState(false)

	const { blocks: registryBlocks, getBlock } = useBlockRegistry()

	// Get allowed block types (exclude 'tabs' to prevent nesting)
	const allowedBlockTypes =
		config.allowedBlockTypes ||
		Array.from(registryBlocks.keys()).filter(slug => slug !== 'tabs')

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	// Show empty state when no tabs in edit mode
	if (editMode && tabs.length === 0) {
		return (
			<EditableWrapper editMode={true}>
				<ConfigEmptyState
					title='No tabs configured'
					description='Configure tabs in the settings to get started.'
				/>
			</EditableWrapper>
		)
	}

	// Don't render if no tabs and not in edit mode
	if (!editMode && tabs.length === 0) {
		return null
	}

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
		if (!currentTabForAdd) return

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

		// Update the specific tab's blocks
		const updatedTabs = tabs.map(tab =>
			tab.id === currentTabForAdd ? { ...tab, blocks: [...tab.blocks, newBlock] } : tab
		)

		await onConfigUpdate?.(blockConfig.id, {
			...config,
			tabs: updatedTabs
		})
		setShowAddModal(false)
		setCurrentTabForAdd(null)
	}

	const handleBlockConfigUpdate = async (
		tabId: string,
		blockId: string,
		newConfig: Record<string, unknown>
	) => {
		const updatedTabs = tabs.map(tab =>
			tab.id === tabId
				? {
						...tab,
						blocks: tab.blocks.map(block =>
							block.id === blockId ? { ...block, config: newConfig } : block
						)
				  }
				: tab
		)

		await onConfigUpdate?.(blockConfig.id, {
			...config,
			tabs: updatedTabs
		})
	}

	const handleDeleteBlock = async (tabId: string, blockId: string) => {
		const updatedTabs = tabs.map(tab =>
			tab.id === tabId
				? {
						...tab,
						blocks: tab.blocks.filter(b => b.id !== blockId)
				  }
				: tab
		)

		await onConfigUpdate?.(blockConfig.id, {
			...config,
			tabs: updatedTabs
		})
	}

	const handleDragEnd = (tabId: string) => (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || active.id === over.id) return

		const tab = tabs.find(t => t.id === tabId)
		if (!tab) return

		const oldIndex = tab.blocks.findIndex(b => b.id === active.id)
		const newIndex = tab.blocks.findIndex(b => b.id === over.id)

		if (oldIndex === -1 || newIndex === -1) return

		const reorderedBlocks = arrayMove(tab.blocks, oldIndex, newIndex)

		const updatedTabs = tabs.map(t => (t.id === tabId ? { ...t, blocks: reorderedBlocks } : t))

		onConfigUpdate?.(blockConfig.id, {
			...config,
			tabs: updatedTabs
		})
	}

	const handleConfigUpdate = async (values: Record<string, unknown>) => {
		await onConfigUpdate?.(blockConfig.id, { ...config, ...values })
		setShowConfigModal(false)
	}

	return (
		<>
			<EditableWrapper editMode={editMode || false}>
				<TabsUI value={activeTab} onValueChange={setActiveTab} orientation={orientation}>
					<TabsList className='w-full justify-start'>
						{tabs.map(tab => (
							<TabsTrigger key={tab.id} value={tab.id}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					{tabs.map(tab => (
						<TabsContent key={tab.id} value={tab.id} className='mt-6'>
							{tab.blocks.length === 0 && editMode ? (
								<ConfigEmptyState
									title={`No blocks in ${tab.label}`}
									description='Add blocks to this tab to display content.'
									action={
										<Button
											onClick={() => {
												setCurrentTabForAdd(tab.id)
												setShowAddModal(true)
											}}
											size='sm'
										>
											<Plus className='h-4 w-4 mr-2' />
											Add Block
										</Button>
									}
								/>
							) : (
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragEnd={handleDragEnd(tab.id)}
								>
									<SortableContext
										items={tab.blocks.map(b => b.id)}
										strategy={verticalListSortingStrategy}
									>
										<div className='space-y-4'>
											{tab.blocks.map(block => {
												const BlockComponent = getBlock(
													block.slug
												)?.Component
												if (!BlockComponent) return null

												return (
													<BlockComponent
														key={block.id}
														blockConfig={block}
														editMode={editMode}
														onConfigUpdate={(blockId, newConfig) =>
															handleBlockConfigUpdate(
																tab.id,
																blockId,
																newConfig
															)
														}
														onDelete={() =>
															handleDeleteBlock(tab.id, block.id)
														}
														record={record}
													/>
												)
											})}
										</div>
									</SortableContext>
								</DndContext>
							)}

							{editMode && tab.blocks.length > 0 && (
								<Button
									onClick={() => {
										setCurrentTabForAdd(tab.id)
										setShowAddModal(true)
									}}
									variant='outline'
									size='sm'
									className='mt-4 w-full'
								>
									<Plus className='h-4 w-4 mr-2' />
									Add Block
								</Button>
							)}
						</TabsContent>
					))}
				</TabsUI>
			</EditableWrapper>

			{/* Add Block Modal */}
			<FormModal
				open={showAddModal}
				onOpenChange={setShowAddModal}
				title='Add Block'
				description='Add a new block to this tab'
				fieldConfig={addModalFieldConfig}
				initialValues={{}}
				onSubmit={handleAddBlock}
			/>
		</>
	)
}
