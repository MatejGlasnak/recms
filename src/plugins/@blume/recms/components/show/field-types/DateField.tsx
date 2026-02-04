'use client'

import type { ShowItem } from '../../../types'

interface DateFieldProps {
	item: ShowItem
	value: unknown
	label: string
}

export function DateField({ item, value, label }: DateFieldProps) {
	let displayValue = '-'

	if (value != null) {
		try {
			const date = new Date(String(value))
			if (!Number.isNaN(date.getTime())) {
				displayValue = date.toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			}
		} catch {
			displayValue = String(value)
		}
	}

	return (
		<div className='space-y-1'>
			<div className='text-sm font-medium text-muted-foreground'>{label}</div>
			<div className='text-sm'>{displayValue}</div>
		</div>
	)
}
