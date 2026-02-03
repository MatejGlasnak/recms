'use client'

import type { ColumnConfig } from '../../../types'

interface ColumnDateProps {
	value: unknown
	columnConfig: ColumnConfig
}

export function ColumnDate({ value, columnConfig }: ColumnDateProps) {
	if (value === null || value === undefined) return <>-</>
	if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
		const date = new Date(value)
		return (
			<>
				{columnConfig.format === 'datetime'
					? date.toLocaleString()
					: date.toLocaleDateString()}
			</>
		)
	}
	return <>{String(value)}</>
}
