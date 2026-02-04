'use client'

import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import type { ShowItem } from '../../../types'

interface RichTextFieldProps {
	item: ShowItem
	value: unknown
	label: string
}

export function RichTextField({ item, value, label }: RichTextFieldProps) {
	const sanitizedHtml = useMemo(() => {
		if (value == null) return '-'
		const html = String(value)
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
	}, [value])

	return (
		<div className='space-y-1'>
			<div className='text-sm font-medium text-muted-foreground'>{label}</div>
			<div
				className='text-sm prose prose-sm max-w-none'
				dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
			/>
		</div>
	)
}
