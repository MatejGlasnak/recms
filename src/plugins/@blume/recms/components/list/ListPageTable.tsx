'use client'

import type { ReactNode } from 'react'
import type { ListConfig } from '../../types'
import { ListColumnsEditor } from './columns-editor/ListColumnsEditor'

export interface ListPageTableProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	children: ReactNode
}

export function ListPageTable({
	resourceId,
	currentConfig,
	editMode,
	children
}: ListPageTableProps) {
	return (
		<ListColumnsEditor
			resourceId={resourceId}
			currentConfig={currentConfig}
			editMode={editMode}
		>
			{children}
		</ListColumnsEditor>
	)
}
