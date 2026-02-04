'use client'

import { useState } from 'react'
import { Tabs as TabsUI, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { BlockComponentProps } from '../../../core/registries/types'
import { useFieldRegistry } from '../../../core/registries'
import { FormModal } from '../../../ui/FormModal'
import { ConfigEmptyState } from '../../../ui/ConfigEmptyState'
import { Grid } from '../grid'
import type { TabsConfig } from './types'
import type { BlockConfig } from '../../../types'
import { tabsConfig } from './config'
import { EditableWrapper } from '../../../ui/EditableWrapper'

export interface TabsProps extends BlockComponentProps {
	record?: Record<string, unknown> | null
}

export function Tabs({ blockConfig, editMode, record, onConfigUpdate, onDelete }: TabsProps) {
	const config = blockConfig.config as unknown as TabsConfig
	const tabs = config.tabs || []
	const defaultTab = config.defaultTab || tabs[0]?.id
	const orientation = config.orientation || 'horizontal'
	// Handle nested config structure from form groups
	const nestingConfig = (config as any).nesting || {}
	// For show pages (when record prop is present), always use 'field' registry type
	const registryType =
		record !== undefined && record !== null
			? 'field'
			: config.registryType || nestingConfig.registryType || 'field'

	const [activeTab, setActiveTab] = useState(defaultTab)
	const [showConfigModal, setShowConfigModal] = useState(false)

	const { fields: registryFields } = useFieldRegistry()

	// Get allowed types based on registry type
	const getAllowedTypes = () => {
		if (registryType === 'field') {
			return Array.from(registryFields.keys())
		}
		// For now, only support fields for show pages
		return []
	}

	const allowedTypes =
		config.allowedSlugs && config.allowedSlugs.length > 0
			? config.allowedSlugs
			: getAllowedTypes()

	const handleConfigUpdate = async (values: Record<string, unknown>) => {
		await onConfigUpdate?.(blockConfig.id, { ...config, ...values } as unknown as Record<
			string,
			unknown
		>)
		setShowConfigModal(false)
	}

	// Show empty state when no tabs in edit mode
	if (editMode && tabs.length === 0) {
		return (
			<>
				<EditableWrapper editMode={true}>
					<div className='cursor-pointer' onClick={() => setShowConfigModal(true)}>
						<ConfigEmptyState
							title='No tabs configured'
							description='Configure tabs in the settings to get started.'
						/>
					</div>
				</EditableWrapper>

				{/* Configuration Modal */}
				<FormModal
					open={showConfigModal}
					onOpenChange={setShowConfigModal}
					title='Configure Tabs'
					description='Configure the tabs settings'
					fieldConfig={tabsConfig}
					initialValues={config as unknown as Record<string, unknown>}
					onSubmit={handleConfigUpdate}
					onDelete={onDelete}
				/>
			</>
		)
	}

	// Don't render if no tabs and not in edit mode
	if (!editMode && tabs.length === 0) {
		return null
	}

	return (
		<>
			<div
				className={`${
					editMode
						? 'cursor-pointer rounded-lg border border-dashed border-primary/40 p-3 hover:border-solid hover:border-primary [&:has(>*:hover)]:border-primary/40'
						: ''
				}`}
				onClick={e => {
					if (editMode && e.target === e.currentTarget) {
						setShowConfigModal(true)
					}
				}}
			>
				<TabsUI value={activeTab} onValueChange={setActiveTab} orientation={orientation}>
					<TabsList className='justify-start w-fit'>
						{tabs.map(tab => (
							<TabsTrigger key={tab.id} value={tab.id}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					{tabs.map(tab => {
						// Create a grid block config for this tab
						// Preserve existing grid config or use defaults
						const existingGridConfig = tab.gridConfig || {}
						const gridBlockConfig: BlockConfig = {
							id: `${blockConfig.id}-${tab.id}-grid`,
							slug: 'grid',
							config: {
								columnsMobile: existingGridConfig.columnsMobile ?? 1,
								columnsTablet: existingGridConfig.columnsTablet ?? 3,
								columnsDesktop: existingGridConfig.columnsDesktop ?? 6,
								blocks: tab.blocks || [],
								registryType: 'field'
							}
						}

						console.log(
							'[Tabs] Rendering tab:',
							tab.id,
							'with grid config:',
							gridBlockConfig.config
						)

						return (
							<TabsContent
								key={tab.id}
								value={tab.id}
								className='mt-6 p-5 border border-border rounded-lg'
								onClick={e => editMode && e.stopPropagation()}
							>
								<Grid
									blockConfig={gridBlockConfig}
									editMode={editMode}
									onConfigUpdate={async (_, gridConfig) => {
										// Update the tab's blocks AND grid config when grid changes
										const updatedTabs = tabs.map(t =>
											t.id === tab.id
												? {
														...t,
														blocks:
															(gridConfig.blocks as BlockConfig[]) ||
															[],
														gridConfig: {
															columnsMobile: gridConfig.columnsMobile,
															columnsTablet: gridConfig.columnsTablet,
															columnsDesktop:
																gridConfig.columnsDesktop
														}
												  }
												: t
										)
										await onConfigUpdate?.(blockConfig.id, {
											...config,
											tabs: updatedTabs
										} as unknown as Record<string, unknown>)
									}}
									allowedBlockTypes={allowedTypes}
									fixedRegistryType={true}
									record={record}
									disabled={true}
									readOnly={true}
								/>
							</TabsContent>
						)
					})}
				</TabsUI>
			</div>

			{/* Configuration Modal */}
			<FormModal
				open={showConfigModal}
				onOpenChange={setShowConfigModal}
				title='Configure Tabs'
				description='Configure the tabs settings'
				fieldConfig={tabsConfig}
				initialValues={config as unknown as Record<string, unknown>}
				onSubmit={handleConfigUpdate}
				onDelete={onDelete}
			/>
		</>
	)
}
