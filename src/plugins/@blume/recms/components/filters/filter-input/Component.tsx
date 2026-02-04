'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BlockComponentProps } from '../../registry/BlockRegistry'

interface FilterInputConfig {
	label?: string
	field?: string
	operator?: 'eq' | 'ne' | 'contains' | 'startsWith' | 'endsWith'
	placeholder?: string
	defaultValue?: string
}

export function FilterInput({
	blockConfig,
	editMode,
	filterValue,
	onFilterChange
}: BlockComponentProps) {
	const config = blockConfig.config as FilterInputConfig
	const label = config.label ?? 'Filter'
	const field = config.field ?? ''
	const placeholder = config.placeholder

	const id = blockConfig.id

	// Get the current filter value
	const currentValue = typeof filterValue === 'function' ? filterValue(field) : filterValue

	// Handle filter value changes
	const handleChange = (value: string) => {
		if (onFilterChange && typeof onFilterChange === 'function') {
			onFilterChange(field, value)
		}
	}

	return (
		<div className='flex flex-col gap-1.5'>
			<Label htmlFor={id} className='text-xs text-muted-foreground'>
				{label}
			</Label>
			<Input
				id={id}
				placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
				value={String(currentValue ?? '')}
				onChange={e => handleChange(e.target.value)}
				className='h-10 w-full'
				disabled={editMode}
			/>
		</div>
	)
}
