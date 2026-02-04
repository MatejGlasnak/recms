'use client'

import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import type { BlockComponentProps } from '../../registry/BlockRegistry'

interface FilterSelectConfig {
	label?: string
	field?: string
	operator?: 'eq' | 'ne' | 'in' | 'nin'
	placeholder?: string
	defaultValue?: string
	options?: { label: string; value: string }[]
}

export function FilterSelect({
	blockConfig,
	editMode,
	filterValue,
	onFilterChange
}: BlockComponentProps) {
	const config = blockConfig.config as FilterSelectConfig
	const label = config.label ?? 'Filter'
	const field = config.field ?? ''
	const placeholder = config.placeholder
	const options = config.options ?? []

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
		<div className='flex flex-col gap-2'>
			<Label htmlFor={id} className='text-sm text-muted-foreground'>
				{label}
			</Label>
			<Select
				value={String(currentValue ?? '')}
				onValueChange={handleChange}
				disabled={editMode}
			>
				<SelectTrigger id={id} className='w-full'>
					<SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}...`} />
				</SelectTrigger>
				<SelectContent>
					{options.map(option => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
