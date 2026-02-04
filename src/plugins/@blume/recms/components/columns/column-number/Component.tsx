'use client'

export interface ColumnNumberProps {
	value: unknown
	format?: string
}

export function ColumnNumber({ value, format }: ColumnNumberProps) {
	if (value === null || value === undefined)
		return <span className='text-muted-foreground'>-</span>
	if (typeof value === 'number') {
		return (
			<>
				{format
					? new Intl.NumberFormat('en-US', {
							...(format.includes('currency')
								? { style: 'currency', currency: 'USD' }
								: {})
					  }).format(value)
					: value.toLocaleString()}
			</>
		)
	}
	return <>{String(value)}</>
}
