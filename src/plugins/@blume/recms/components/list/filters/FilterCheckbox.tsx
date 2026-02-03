'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FilterConfig } from '../../../types'

interface FilterCheckboxProps {
	filter: FilterConfig
	value: boolean
	onChange: (value: boolean) => void
	disabled?: boolean
}

export function FilterCheckbox({ filter, value, onChange, disabled = false }: FilterCheckboxProps) {
	return (
		<div className='flex items-center gap-2 h-10'>
			<Checkbox
				id={filter.id}
				checked={value === true}
				onCheckedChange={checked => onChange(!!checked)}
				disabled={disabled}
			/>
			<Label htmlFor={filter.id} className='cursor-pointer'>
				{filter.label}
			</Label>
		</div>
	)
}
