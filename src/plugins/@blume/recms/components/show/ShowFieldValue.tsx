'use client'

import type { ShowItem } from '../../types/show-config'

export interface ShowFieldValueProps {
	value: unknown
	item: ShowItem
}

export function ShowFieldValue({ value, item }: ShowFieldValueProps) {
	if (value === null || value === undefined) {
		return <span className='text-muted-foreground'>—</span>
	}

	switch (item.type) {
		case 'number': {
			const num = typeof value === 'number' ? value : Number(value)
			if (Number.isNaN(num)) return <>{String(value)}</>
			return <span className='tabular-nums'>{num.toLocaleString()}</span>
		}
		case 'date': {
			const date =
				value instanceof Date
					? value
					: typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)
					? new Date(value)
					: new Date(String(value))
			if (Number.isNaN(date.getTime())) return <>{String(value)}</>
			return (
				<time dateTime={date.toISOString()} className='text-foreground'>
					{date.toLocaleDateString(undefined, {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</time>
			)
		}
		case 'richtext':
			return (
				<div
					className='prose prose-sm dark:prose-invert max-w-none text-foreground [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4'
					dangerouslySetInnerHTML={{
						__html: typeof value === 'string' ? value : String(value)
					}}
				/>
			)
		case 'text':
		default:
			return <span className='text-foreground'>{String(value)}</span>
	}
}
