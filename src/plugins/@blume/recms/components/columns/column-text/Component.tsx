'use client'

export interface ColumnTextProps {
	value: unknown
}

export function ColumnText({ value }: ColumnTextProps) {
	if (value === null || value === undefined) return <>-</>
	return <>{String(value)}</>
}
