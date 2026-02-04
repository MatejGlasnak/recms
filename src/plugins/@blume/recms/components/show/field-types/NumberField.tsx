'use client'

import type { ShowItem } from '../../../types'

interface NumberFieldProps {
	item: ShowItem
	value: unknown
	label: string
}

export function NumberField({ item, value, label }: NumberFieldProps) {
	const displayValue =
		value != null && !Number.isNaN(Number(value)) ? Number(value).toLocaleString() : '-'

	return (
		<div className='space-y-1'>
			<div className='text-sm font-medium text-muted-foreground'>{label}</div>
			<div className='text-sm font-mono'>{displayValue}</div>
		</div>
	)
}
