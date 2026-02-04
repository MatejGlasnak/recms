'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export interface FilterSelectProps {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	options?: { label: string; value: string }[]
	disabled?: boolean
}

export function FilterSelect({
	id,
	label,
	value,
	onChange,
	placeholder,
	options = [],
	disabled = false
}: FilterSelectProps) {
	return (
		<div className='flex flex-col gap-1.5'>
			<Label htmlFor={id} className='text-xs text-muted-foreground'>
				{label}
			</Label>
			<Select value={value || ''} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger id={id} className='h-10 w-[240px]'>
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
