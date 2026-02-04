'use client'

export interface ColumnJsonProps {
	value: unknown
}

export function ColumnJson({ value }: ColumnJsonProps) {
	if (value === null || value === undefined)
		return <span className='text-muted-foreground'>-</span>
	if (typeof value === 'object') {
		return (
			<code className='rounded bg-muted px-2 py-1 text-xs'>
				{JSON.stringify(value, null, 2)}
			</code>
		)
	}
	return <>{String(value)}</>
}
