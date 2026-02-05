'use client'

import { Badge } from '@/components/ui/badge'

export interface ColumnBadgeProps {
	value: unknown
	variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function ColumnBadge({ value, variant = 'default' }: ColumnBadgeProps) {
	if (value === null || value === undefined) return <>-</>
	return <Badge variant={variant}>{String(value)}</Badge>
}
