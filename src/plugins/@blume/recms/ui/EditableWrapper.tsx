'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { selectableRegistry } from '../core/SelectableRegistry'

export interface EditableWrapperProps {
	editMode: boolean
	onEditClick?: () => void
	children: ReactNode
	className?: string
	selectableId?: string // Optional ID for selectable system
}

export function EditableWrapper({
	editMode,
	onEditClick,
	children,
	className = '',
	selectableId
}: EditableWrapperProps) {
	// Register callback if using selectable system
	useEffect(() => {
		if (editMode && selectableId && onEditClick) {
			selectableRegistry.register(selectableId, onEditClick)
			return () => selectableRegistry.unregister(selectableId)
		}
	}, [editMode, selectableId, onEditClick])

	if (!editMode) {
		return <>{children}</>
	}

	// If using selectable system
	if (selectableId) {
		return (
			<div
				data-recms-selectable='wrapper'
				data-recms-callback-id={selectableId}
				className={className}
			>
				{children}
			</div>
		)
	}

	// Fallback to old behavior for non-selectable wrappers
	return (
		<div
			className={`p-3 cursor-pointer transition-all border border-dashed border-primary/40 rounded-md hover:border-primary hover:border-solid${
				className ? ` ${className}` : ''
			}`}
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
			{children}
		</div>
	)
}
