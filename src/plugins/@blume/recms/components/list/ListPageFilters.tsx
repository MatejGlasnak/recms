'use client'

import { useState } from 'react'
import type { ListConfig } from '../../types'
import { EditableWrapper } from '../ui/EditableWrapper'
import { FilterField } from './filters/FilterField'
import { ListFiltersEditor } from './filters-editor/ListFiltersEditor'

export interface ListPageFiltersProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	filters: Record<string, unknown>
	onFilterChange: (filters: Record<string, unknown>) => void
}

export function ListPageFilters({
	resourceId,
	currentConfig,
	editMode,
	filters,
	onFilterChange
}: ListPageFiltersProps) {
	const [editorOpen, setEditorOpen] = useState(false)
	const configuredFilters = currentConfig?.filters || []

	const handleFilterValueChange = (fieldName: string, value: unknown) => {
		onFilterChange({
			...filters,
			[fieldName]: value
		})
	}

	const handleClearFilter = (fieldName: string) => {
		const newFilters = { ...filters }
		delete newFilters[fieldName]
		onFilterChange(newFilters)
	}

	const filterContent = (
		<div className='flex items-center gap-4 flex-wrap'>
			{configuredFilters.length === 0 ? (
				<div className='text-sm text-muted-foreground'>
					No filters configured. Click to add filters.
				</div>
			) : (
				configuredFilters.map(filter => (
					<FilterField
						key={filter.id}
						filter={filter}
						value={filters[filter.field]}
						onChange={value => handleFilterValueChange(filter.field, value)}
						onClear={() => handleClearFilter(filter.field)}
						disabled={editMode}
					/>
				))
			)}
		</div>
	)

	return (
		<>
			<EditableWrapper
				editMode={editMode}
				onEditClick={() => setEditorOpen(true)}
				className='p-3'
			>
				{filterContent}
			</EditableWrapper>

			<ListFiltersEditor
				resourceId={resourceId}
				currentConfig={currentConfig}
				open={editorOpen}
				onOpenChange={setEditorOpen}
			/>
		</>
	)
}
