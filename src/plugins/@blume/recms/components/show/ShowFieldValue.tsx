'use client'

import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import { format as formatDate, parseISO, isValid } from 'date-fns'
import { sk } from 'date-fns/locale'
import type { ShowItem } from '../../types/show-config'

export interface ShowFieldValueProps {
	value: unknown
	item: ShowItem
}

export function ShowFieldValue({ value, item }: ShowFieldValueProps) {
	// Memoize sanitized HTML for richtext to avoid re-sanitizing on every render
	const sanitizedHtml = useMemo(() => {
		if (item.type === 'richtext' && value != null) {
			const html = typeof value === 'string' ? value : String(value)
			return DOMPurify.sanitize(html, {
				ALLOWED_TAGS: [
					'p',
					'br',
					'strong',
					'em',
					'u',
					'a',
					'ul',
					'ol',
					'li',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'blockquote',
					'code',
					'pre'
				],
				ALLOWED_ATTR: ['href', 'target', 'rel']
			})
		}
		return ''
	}, [value, item.type])

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
			try {
				let date: Date | null = null

				if (value instanceof Date) {
					date = value
				} else if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
					date = parseISO(value)
				} else {
					date = new Date(String(value))
				}

				if (!date || !isValid(date)) return <>{String(value)}</>

				// Slovak format: 24.12.2026
				const formatted = formatDate(date, 'dd.MM.yyyy', { locale: sk })

				return (
					<time dateTime={date.toISOString()} className='text-foreground'>
						{formatted}
					</time>
				)
			} catch (error) {
				return <>{String(value)}</>
			}
		}
		case 'richtext':
			return (
				<div
					className='prose prose-sm dark:prose-invert max-w-none text-foreground [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4'
					dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
				/>
			)
		case 'text':
		default:
			return <span className='text-foreground'>{String(value)}</span>
	}
}
