'use client'

export interface ColumnBooleanProps {
	value: unknown
}

export function ColumnBoolean({ value }: ColumnBooleanProps) {
	if (value === null || value === undefined) return <>-</>
	return <>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</>
}
