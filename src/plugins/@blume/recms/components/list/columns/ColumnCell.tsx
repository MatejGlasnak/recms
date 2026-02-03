'use client'

import type { ReactNode } from 'react'
import type { ColumnConfig } from '../../../types'
import { ColumnText } from './ColumnText'
import { ColumnNumber } from './ColumnNumber'
import { ColumnDate } from './ColumnDate'
import { ColumnBoolean } from './ColumnBoolean'
import { ColumnBadge } from './ColumnBadge'
import { ColumnJson } from './ColumnJson'

export interface ColumnCellProps {
	value: unknown
	columnConfig: ColumnConfig
}

export function ColumnCell({ value, columnConfig }: ColumnCellProps): ReactNode {
	switch (columnConfig.type) {
		case 'text':
			return <ColumnText value={value} columnConfig={columnConfig} />
		case 'number':
			return <ColumnNumber value={value} columnConfig={columnConfig} />
		case 'date':
			return <ColumnDate value={value} columnConfig={columnConfig} />
		case 'boolean':
			return <ColumnBoolean value={value} columnConfig={columnConfig} />
		case 'badge':
			return <ColumnBadge value={value} columnConfig={columnConfig} />
		case 'json':
			return <ColumnJson value={value} columnConfig={columnConfig} />
		default:
			return <>{value === null || value === undefined ? '-' : String(value)}</>
	}
}
