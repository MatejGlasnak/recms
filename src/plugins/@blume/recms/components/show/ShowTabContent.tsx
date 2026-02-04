'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ConfigEmptyState } from '../ui/ConfigEmptyState'
import { EditableWrapper } from '../ui/EditableWrapper'
import type { ListConfig, ShowConfig } from '../../types'
import { ShowFieldsEditor } from './ShowFieldsEditor'
import { ShowTabsEditor } from './ShowTabsEditor'
import { Plus } from 'lucide-react'

export interface ShowTabContentProps {
	resourceId: string
	listConfig: ListConfig | undefined
	showConfig: ShowConfig | undefined
	editMode: boolean
	/** When true, show empty state (no groups in this tab). */
	empty: boolean
	/** Whether at least one tab exists in config (required before editing groups). */
	hasTabs: boolean
	/** Index of the tab this content belongs to (for group editing). */
	tabIndex: number
	/** Controlled open state for the tab creation/configuration dialog. */
	tabEditorOpen?: boolean
	onTabEditorOpenChange?: (open: boolean) => void
	/** Called when user should open the tab editor (e.g. "Create tab" button). */
	onOpenTabEditor?: () => void
	children: ReactNode
}

export function ShowTabContent({
	resourceId,
	listConfig,
	showConfig,
	editMode,
	empty,
	hasTabs,
	tabIndex,
	tabEditorOpen,
	onTabEditorOpenChange,
	onOpenTabEditor,
	children
}: ShowTabContentProps) {
	const [fieldsEditorOpen, setFieldsEditorOpen] = useState(false)

	// No tabs: do not allow groups edit; show CTA to create a tab
	if (empty && !hasTabs) {
		return (
			<>
				<EditableWrapper editMode={editMode} onEditClick={onOpenTabEditor} className='p-4'>
					<ConfigEmptyState
						title='No tabs configured'
						description={
							editMode
								? 'Create a tab first, then add groups and fields to it.'
								: 'Enable Edit mode to configure show page tabs and content.'
						}
						action={
							editMode && onOpenTabEditor ? (
								<Button onClick={onOpenTabEditor} size='sm'>
									<Plus className='h-4 w-4 mr-2' />
									Create tab
								</Button>
							) : undefined
						}
					/>
				</EditableWrapper>
				{showConfig !== undefined && (
					<ShowTabsEditor
						resourceId={resourceId}
						showConfig={showConfig}
						open={tabEditorOpen ?? false}
						onOpenChange={onTabEditorOpenChange ?? (() => {})}
					/>
				)}
			</>
		)
	}

	// Empty tab (has tabs but this tab has no groups): allow editing groups for this tab
	if (empty) {
		return (
			<>
				<EditableWrapper
					editMode={editMode}
					onEditClick={() => setFieldsEditorOpen(true)}
					className='p-4'
				>
					<ConfigEmptyState
						title='No content configured'
						description={
							editMode
								? 'Click here to add groups and fields for this tab.'
								: 'Enable Edit mode to configure show page content.'
						}
					/>
				</EditableWrapper>
				{listConfig && (
					<ShowFieldsEditor
						resourceId={resourceId}
						listConfig={listConfig}
						showConfig={showConfig}
						tabIndex={tabIndex}
						open={fieldsEditorOpen}
						onOpenChange={setFieldsEditorOpen}
					/>
				)}
			</>
		)
	}

	// Tab has content: show it and allow editing
	return (
		<>
			<EditableWrapper
				editMode={editMode}
				onEditClick={() => setFieldsEditorOpen(true)}
				className='p-4'
			>
				{children}
			</EditableWrapper>
			{listConfig && (
				<ShowFieldsEditor
					resourceId={resourceId}
					listConfig={listConfig}
					showConfig={showConfig}
					tabIndex={tabIndex}
					open={fieldsEditorOpen}
					onOpenChange={setFieldsEditorOpen}
				/>
			)}
		</>
	)
}
