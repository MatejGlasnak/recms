'use client'

import type { ReactNode } from 'react'

export interface EditableWrapperProps {
	editMode: boolean
	onEditClick?: () => void
	children: ReactNode
	className?: string
}

const editModeClassName =
	'cursor-pointer transition-all border-2 border-dashed border-muted-foreground/30 rounded-md hover:border-primary hover:border-solid'

export function EditableWrapper({
	editMode,
	onEditClick,
	children,
	className = ''
}: EditableWrapperProps) {
	if (!editMode) {
		return <>{children}</>
	}
	return (
		<div
			className={editModeClassName + (className ? ` ${className}` : '')}
			onClick={onEditClick}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault()
					onEditClick?.()
				}
			}}
			role={onEditClick ? 'button' : undefined}
			tabIndex={onEditClick ? 0 : undefined}
		>
			<div className={editMode ? 'pointer-events-none' : ''}>{children}</div>
		</div>
	)
}
