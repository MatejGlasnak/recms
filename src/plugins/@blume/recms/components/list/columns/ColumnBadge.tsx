'use client'

import { Badge } from '@/components/ui/badge'
import type { ColumnConfig } from '../../../types'

interface ColumnBadgeProps {
	value: unknown
	columnConfig: ColumnConfig
}

export function ColumnBadge({ value, columnConfig }: ColumnBadgeProps) {
	if (value === null || value === undefined) return <>-</>
	return <Badge variant={columnConfig.badgeVariant || 'default'}>{String(value)}</Badge>
}
