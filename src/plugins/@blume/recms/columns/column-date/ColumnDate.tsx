'use client'

import { format as formatDate, parseISO, isValid } from 'date-fns'
import { sk } from 'date-fns/locale'

export interface ColumnDateProps {
	value: unknown
	format?: string
}

export function ColumnDate({ value, format: formatType }: ColumnDateProps) {
	if (value === null || value === undefined)
		return <span className='text-muted-foreground'>-</span>

	let date: Date | null = null
	let formattedValue: string | null = null

	// Try to parse the date
	try {
		if (value instanceof Date) {
			date = value
		} else if (typeof value === 'string') {
			// Try ISO format first
			if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
				date = parseISO(value)
			} else {
				date = new Date(value)
			}
		} else if (typeof value === 'number') {
			date = new Date(value)
		}

		if (date && isValid(date)) {
			// Slovak format: 24.12.2026 16:30
			const dateFormat = formatType === 'datetime' ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy'
			formattedValue = formatDate(date, dateFormat, { locale: sk })
		}
	} catch (error) {
		console.error('Error formatting date:', error)
	}

	return <>{formattedValue ?? String(value)}</>
}
