'use client'

export interface ColumnJsonProps {
	value: unknown
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
