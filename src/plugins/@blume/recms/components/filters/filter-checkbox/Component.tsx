'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export interface FilterCheckboxProps {
	id: string
	label: string
	value: boolean
	onChange: (value: boolean) => void
	disabled?: boolean
}

export function FilterCheckbox({
	id,
	label,
	value,
	onChange,
	disabled = false
}: FilterCheckboxProps) {
	return (
		<div className='flex items-center gap-2 h-10'>
			<Checkbox
				id={id}
				checked={value === true}
				onCheckedChange={checked => onChange(!!checked)}
				disabled={disabled}
			/>
			<Label htmlFor={id} className='cursor-pointer'>
				{label}
			</Label>
		</div>
	)
}
