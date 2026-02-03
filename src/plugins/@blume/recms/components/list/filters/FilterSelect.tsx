'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { FilterConfig } from '../../../types'

interface FilterSelectProps {
	filter: FilterConfig
	value: string
	onChange: (value: string) => void
	disabled?: boolean
}

export function FilterSelect({ filter, value, onChange, disabled = false }: FilterSelectProps) {
	return (
		<div className='flex flex-col gap-1.5'>
			<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
			<Select value={value || ''} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger className='h-10 w-[240px]'>
					<SelectValue
						placeholder={
							filter.placeholder || `Select ${filter.label.toLowerCase()}...`
						}
					/>
				</SelectTrigger>
				<SelectContent>
					{filter.options?.map(option => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
