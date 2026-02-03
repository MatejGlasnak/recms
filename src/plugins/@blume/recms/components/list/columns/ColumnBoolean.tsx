'use client'

import type { ColumnConfig } from '../../../types'

interface ColumnBooleanProps {
	value: unknown
	columnConfig: ColumnConfig
}

export function ColumnBoolean({ value }: ColumnBooleanProps) {
	if (value === null || value === undefined) return <>-</>
	return <>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</>
}
