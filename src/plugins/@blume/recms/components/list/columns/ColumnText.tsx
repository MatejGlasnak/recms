'use client'

import type { ColumnConfig } from '../../../types'

interface ColumnTextProps {
	value: unknown
	columnConfig: ColumnConfig
}

export function ColumnText({ value }: ColumnTextProps) {
	if (value === null || value === undefined) return <>-</>
	return <>{String(value)}</>
}
