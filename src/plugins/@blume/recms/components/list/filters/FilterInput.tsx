'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FilterConfig } from '../../../types'

interface FilterInputProps {
	filter: FilterConfig
	value: string
	onChange: (value: string) => void
	disabled?: boolean
}

export function FilterInput({ filter, value, onChange, disabled = false }: FilterInputProps) {
	return (
		<div className='flex flex-col gap-1.5'>
			<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
			<Input
				placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}...`}
				value={value || ''}
				onChange={e => onChange(e.target.value)}
				className='h-10 w-[240px]'
				disabled={disabled}
			/>
		</div>
	)
}
