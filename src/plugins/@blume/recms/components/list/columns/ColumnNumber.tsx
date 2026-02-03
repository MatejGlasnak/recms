'use client'

import type { ColumnConfig } from '../../../types'

interface ColumnNumberProps {
	value: unknown
	columnConfig: ColumnConfig
}

export function ColumnNumber({ value, columnConfig }: ColumnNumberProps) {
	if (value === null || value === undefined) return <>-</>
	if (typeof value === 'number') {
		return (
			<>
				{columnConfig.format
					? new Intl.NumberFormat('en-US', {
							...(columnConfig.format.includes('currency')
								? { style: 'currency', currency: 'USD' }
								: {})
					  }).format(value)
					: value.toLocaleString()}
			</>
		)
	}
	return <>{String(value)}</>
}
