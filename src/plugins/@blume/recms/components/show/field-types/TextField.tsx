'use client'

import type { ShowItem } from '../../../types'

interface TextFieldProps {
	item: ShowItem
	value: unknown
	label: string
}

export function TextField({ item, value, label }: TextFieldProps) {
	const displayValue = value != null ? String(value) : '-'

	return (
		<div className='space-y-1'>
			<div className='text-sm font-medium text-muted-foreground'>{label}</div>
			<div className='text-sm'>{displayValue}</div>
		</div>
	)
}
