'use client'

import type { ColumnConfig } from '../../../types'

interface ColumnJsonProps {
	value: unknown
	columnConfig: ColumnConfig
}

export function ColumnJson({ value }: ColumnJsonProps) {
	if (value === null || value === undefined) return <>-</>
	if (typeof value === 'object') {
		return (
			<code className='text-xs bg-muted px-2 py-1 rounded'>
				{JSON.stringify(value, null, 2)}
			</code>
		)
	}
	return <>{String(value)}</>
}
