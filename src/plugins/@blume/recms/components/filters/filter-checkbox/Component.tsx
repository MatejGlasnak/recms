'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { BlockComponentProps } from '../../registry/BlockRegistry'

interface FilterCheckboxConfig {
	label?: string
	field?: string
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

	// Handle filter value changes
	const handleChange = (value: boolean) => {
		if (onFilterChange && typeof onFilterChange === 'function') {
			onFilterChange(field, value)
		}
	}

	return (
		<div className='flex items-center gap-2 h-10 w-full'>
			<Checkbox
				id={id}
				checked={Boolean(filterValue)}
				onCheckedChange={checked => handleChange(!!checked)}
				disabled={editMode}
			/>
			<Label htmlFor={id} className='cursor-pointer'>
				{label}
			</Label>
		</div>
	)
}
