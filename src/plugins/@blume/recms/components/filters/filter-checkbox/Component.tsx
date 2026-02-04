'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { BlockComponentProps } from '../../registry/BlockRegistry'

interface FilterCheckboxConfig {
	label?: string
	field?: string
	operator?: 'eq' | 'ne'
	defaultValue?: boolean
}

export function FilterCheckbox({
	blockConfig,
	editMode,
	filterValue,
	onFilterChange
}: BlockComponentProps) {
	const config = blockConfig.config as FilterCheckboxConfig
	const label = config.label ?? 'Filter'
	const field = config.field ?? ''

	const id = blockConfig.id

	// Get the current filter value
	const currentValue = typeof filterValue === 'function' ? filterValue(field) : filterValue

	// Handle filter value changes
	const handleChange = (value: boolean) => {
		if (onFilterChange && typeof onFilterChange === 'function') {
			onFilterChange(field, value)
		}
	}

	return (
		<div className='flex h-10 w-full items-center gap-2'>
			<Checkbox
				id={id}
				checked={Boolean(currentValue)}
				onCheckedChange={checked => handleChange(!!checked)}
				disabled={editMode}
			/>
			<Label htmlFor={id} className='cursor-pointer text-sm'>
				{label}
			</Label>
		</div>
	)
}
