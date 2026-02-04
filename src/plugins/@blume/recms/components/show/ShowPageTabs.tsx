'use client'

import { useState, type ReactNode } from 'react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditableWrapper } from '../ui/EditableWrapper'
import type { ShowConfig, ShowTab } from '../../types'
import { ShowTabsEditor } from './ShowTabsEditor'

export interface ShowPageTabsProps {
	resourceId: string
	showConfig: ShowConfig | undefined
	editMode: boolean
	tabs: ShowTab[]
	normalizeTabValue: (label: string, index: number) => string
	/** When set, the tab at this index is a placeholder (e.g. no tabs configured); render label muted. */
	placeholderTabIndex?: number | null
	/** Controlled open state for the tab configuration dialog. */
	tabEditorOpen?: boolean
	onTabEditorOpenChange?: (open: boolean) => void
	children?: ReactNode
}

export function ShowPageTabs({
	resourceId,
	showConfig,
	editMode,
	tabs,
	normalizeTabValue,
	placeholderTabIndex = null,
	tabEditorOpen: controlledOpen,
	onTabEditorOpenChange,
	children
}: ShowPageTabsProps) {
	const [internalOpen, setInternalOpen] = useState(false)
	const isControlled = controlledOpen !== undefined && onTabEditorOpenChange !== undefined
	const editorOpen = isControlled ? controlledOpen : internalOpen
	const setEditorOpen = isControlled ? onTabEditorOpenChange! : setInternalOpen
	const showTabs = showConfig?.showTabs ?? true

	// When showTabs is false: hide in view mode; in edit mode show with 50% opacity
	const hidden = !showTabs && !editMode
	const dimmed = !showTabs && editMode

	if (hidden) {
		return null
	}

	const tabsListContent = children ?? (
		<TabsList variant='line' className='w-full justify-start'>
			{tabs.map((tab, index) => (
				<TabsTrigger
					key={normalizeTabValue(tab.label, index)}
					value={normalizeTabValue(tab.label, index)}
					variant='line'
					className={placeholderTabIndex === index ? 'text-muted-foreground' : undefined}
				>
					{tab.label}
				</TabsTrigger>
			))}
		</TabsList>
	)

	return (
		<>
			<EditableWrapper
				editMode={editMode}
				onEditClick={() => setEditorOpen(true)}
				className={dimmed ? 'opacity-50 p-4' : 'p-4'}
			>
				{tabsListContent}
			</EditableWrapper>
			<ShowTabsEditor
				resourceId={resourceId}
				showConfig={showConfig}
				open={editorOpen}
				onOpenChange={setEditorOpen}
			/>
		</>
	)
}
