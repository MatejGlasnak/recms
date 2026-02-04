'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { FilterInput } from '../../filters/filter-input'
import { FilterSelect } from '../../filters/filter-select'
import { FilterCombobox } from '../../filters/filter-combobox'
import { FilterCheckbox } from '../../filters/filter-checkbox'
import type { BlockComponentProps } from '../../registry'
import type { FilterConfig } from '../../../types/block-config'
import { useState } from 'react'
import { FormModal } from '../../form/FormModal'
import { listFiltersConfig } from './config'

interface FilterFieldProps {
	filter: FilterConfig
	value: unknown
	onChange: (value: unknown) => void
	disabled?: boolean
}

function FilterField({ filter, value, onChange, disabled }: FilterFieldProps) {
	switch (filter.type) {
		case 'input':
			return (
				<FilterInput
					id={filter.id}
					label={filter.label}
					value={String(value ?? '')}
					onChange={onChange}
					placeholder={filter.placeholder}
					disabled={disabled}
				/>
			)
		case 'select':
			return (
				<FilterSelect
					id={filter.id}
					label={filter.label}
					value={String(value ?? '')}
					onChange={onChange}
					placeholder={filter.placeholder}
					options={filter.options}
					disabled={disabled}
				/>
			)
		case 'combobox':
			return (
				<FilterCombobox
					id={filter.id}
					label={filter.label}
					value={(value ?? (filter.multiple ? [] : '')) as string | string[]}
					onChange={onChange}
					placeholder={filter.placeholder}
					options={filter.options}
					multiple={filter.multiple}
					disabled={disabled}
				/>
			)
		case 'checkbox':
			return (
				<FilterCheckbox
					id={filter.id}
					label={filter.label}
					value={Boolean(value)}
					onChange={onChange}
					disabled={disabled}
				/>
			)
		default:
			return null
	}
}

export function ListFilters({
	blockConfig,
	editMode,
	onConfigUpdate,
	filterValues: externalFilterValues,
	onFilterChange: externalOnFilterChange
}: BlockComponentProps) {
	const [showSettings, setShowSettings] = useState(false)
	const [localFilterValues, setLocalFilterValues] = useState<Record<string, unknown>>({})

	// Use external filter values if provided, otherwise use local state
	const filterValues = externalFilterValues
		? (externalFilterValues as Record<string, unknown>)
		: localFilterValues
	const onFilterChangeHandler = externalOnFilterChange
		? (externalOnFilterChange as (values: Record<string, unknown>) => void)
		: setLocalFilterValues

	const config = blockConfig.config as {
		filters?: FilterConfig[]
	}

	const filters = config.filters ?? []

	const handleFilterChange = (filterId: string, value: unknown) => {
		onFilterChangeHandler({ ...filterValues, [filterId]: value })
	}

	const handleClearFilters = () => {
		onFilterChangeHandler({})
	}

	const hasActiveFilters = Object.values(filterValues).some(v => {
		if (Array.isArray(v)) return v.length > 0
		if (typeof v === 'boolean') return v
		return v !== null && v !== undefined && v !== ''
	})

	const handleSaveSettings = async (values: Record<string, unknown>) => {
		if (onConfigUpdate) {
			await onConfigUpdate(blockConfig.id, values)
		}
		setShowSettings(false)
	}

	if (filters.length === 0 && !editMode) {
		return null
	}

	const showSampleFilter = filters.length === 0 && editMode

	return (
		<>
			<div
				className='relative flex items-center gap-4 mb-6'
				onClick={editMode ? () => setShowSettings(true) : undefined}
			>
				{showSampleFilter ? (
					<div className='opacity-50'>
						<FilterInput
							id='sample-search'
							label='Search'
							value=''
							onChange={() => {}}
							placeholder='Type to search...'
							disabled={true}
						/>
					</div>
				) : (
					<>
						{filters.map(filter => (
							<FilterField
								key={filter.id}
								filter={filter}
								value={filterValues[filter.id]}
								onChange={value => handleFilterChange(filter.id, value)}
								disabled={editMode}
							/>
						))}
						{hasActiveFilters && (
							<Button
								variant='ghost'
								size='sm'
								onClick={e => {
									e.stopPropagation()
									handleClearFilters()
								}}
								className='shrink-0'
								disabled={editMode}
							>
								<X className='mr-2 h-4 w-4' />
								Clear
							</Button>
						)}
					</>
				)}
			</div>

			<FormModal
				open={showSettings}
				onOpenChange={setShowSettings}
				title='Filter Settings'
				description='Configure the list page filters'
				fieldConfig={listFiltersConfig}
				initialValues={config}
				onSubmit={handleSaveSettings}
			/>
		</>
	)
}
