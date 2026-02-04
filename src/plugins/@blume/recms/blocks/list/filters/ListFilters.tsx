'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Grid } from '../../../blocks/layouts/grid'
import { FormModal } from '../../../ui/FormModal'
import { listFiltersConfig } from './config'
import type { BlockComponentProps } from '../../../core/registries'
import type { BlockConfig } from '../../../types/block-config'
import { useState } from 'react'

interface NestedBlockConfig {
	id: string
	slug: string
	columnSpan?: number
	config: Record<string, unknown>
}

interface ListFiltersConfig extends Record<string, unknown> {
	title?: string
	description?: string
	columns?: number
	blocks?: NestedBlockConfig[]
}

export function ListFilters({
	blockConfig,
	editMode,
	onConfigUpdate,
	filterValues: externalFilterValues,
	onFilterChange: externalOnFilterChange,
	onDelete
}: BlockComponentProps) {
	const [localFilterValues, setLocalFilterValues] = useState<Record<string, unknown>>({})
	const [showConfigModal, setShowConfigModal] = useState(false)

	// Use external filter values if provided, otherwise use local state
	const filterValues = externalFilterValues
		? (externalFilterValues as Record<string, unknown>)
		: localFilterValues
	const onFilterChangeHandler = externalOnFilterChange
		? (externalOnFilterChange as (values: Record<string, unknown>) => void)
		: setLocalFilterValues

	const config = blockConfig.config as ListFiltersConfig
	const blocks = config.blocks ?? []
	const title = config.title
	const description = config.description

	const handleFilterChange = (field: string, value: unknown) => {
		onFilterChangeHandler({ ...filterValues, [field]: value })
	}

	const handleClearFilters = () => {
		onFilterChangeHandler({})
	}

	const hasActiveFilters = Object.values(filterValues).some(v => {
		if (Array.isArray(v)) return v.length > 0
		if (typeof v === 'boolean') return v
		return v !== null && v !== undefined && v !== ''
	})

	if (blocks.length === 0 && !editMode) {
		return null
	}

	// Create a modified blockConfig for the Grid with filter-specific props
	const gridBlockConfig: BlockConfig = {
		...blockConfig,
		config: {
			columns: config.columns ?? 6,
			blocks: blocks
		}
	}

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

	return (
		<>
			<div
				className={`space-y-4 !my-6 ${
					editMode
						? 'cursor-pointer rounded-lg border border-dashed border-primary/40 p-3 hover:border-solid hover:border-primary [&:has(>*:hover)]:border-primary/40'
						: ''
				}`}
				onClick={e => {
					if (editMode) {
						// Only open config if clicking directly on the container, not on children
						if (e.target === e.currentTarget) {
							setShowConfigModal(true)
						}
					}
				}}
			>
				{/* Header with Title and Description */}
				{(title || description) && (
					<div className='flex items-start justify-between gap-4'>
						<div className='flex-1'>
							{title && <h3 className='text-lg font-semibold'>{title}</h3>}
							{description && (
								<p className='mt-1 text-sm text-muted-foreground'>{description}</p>
							)}
						</div>
					</div>
				)}

				{/* Filters Grid */}
				<div
					className='flex items-start gap-4'
					onClick={e => editMode && e.stopPropagation()}
				>
					<div className='flex-1' onClick={e => editMode && e.stopPropagation()}>
						<Grid
							blockConfig={gridBlockConfig}
							editMode={editMode}
							onConfigUpdate={onConfigUpdate}
							filterValue={(field: string) => filterValues[field]}
							onFilterChange={handleFilterChange}
							allowedBlockTypes={[
								'filter-input',
								'filter-select',
								'filter-combobox',
								'filter-checkbox'
							]}
						/>
					</div>
					{hasActiveFilters && !editMode && (
						<Button
							variant='ghost'
							size='sm'
							onClick={e => {
								e.stopPropagation()
								handleClearFilters()
							}}
							className='mt-2 shrink-0'
						>
							<X className='mr-2 size-4' />
							Clear
						</Button>
					)}
				</div>
			</div>

			{/* Configuration Modal */}
			<FormModal
				open={showConfigModal}
				onOpenChange={setShowConfigModal}
				title='Configure Filters'
				description='Configure the filters block settings'
				fieldConfig={listFiltersConfig}
				initialValues={config}
				onSubmit={handleConfigUpdate}
				onDelete={onDelete ? handleDelete : undefined}
			/>
		</>
	)
}
