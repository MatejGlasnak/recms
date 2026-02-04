'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface FilterInputProps {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
}

export function FilterInput({
	id,
	label,
	value,
	onChange,
	placeholder,
	disabled = false
}: FilterInputProps) {
	return (
		<div className='flex flex-col gap-1.5'>
			<Label htmlFor={id} className='text-xs text-muted-foreground'>
				{label}
			</Label>
			<Input
				id={id}
				placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
				value={value || ''}
				onChange={e => onChange(e.target.value)}
				className='h-10 w-[240px]'
				disabled={disabled}
			/>
		</div>
	)
}
