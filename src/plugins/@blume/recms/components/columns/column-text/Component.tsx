'use client'

export interface ColumnTextProps {
	value: unknown
}

export function ColumnText({ value }: ColumnTextProps) {
	if (value === null || value === undefined)
		return <span className='text-muted-foreground'>-</span>
	return <>{String(value)}</>
}
