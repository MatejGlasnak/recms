'use client'

import type { ShowItem } from '../../../types'

interface RichTextFieldProps {
	item: ShowItem
	value: unknown
	label: string
}

export function RichTextField({ item, value, label }: RichTextFieldProps) {
	const displayValue = value != null ? String(value) : '-'

	return (
		<div className='space-y-1'>
			<div className='text-sm font-medium text-muted-foreground'>{label}</div>
			<div
				className='text-sm prose prose-sm max-w-none'
				dangerouslySetInnerHTML={{ __html: displayValue }}
			/>
		</div>
	)
}
