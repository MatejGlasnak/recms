'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Field, FieldContent, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import {
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useUpdateShowConfig } from '../../hooks'
import type { ShowConfig, ShowTab } from '../../types'

export interface ShowTabsEditorProps {
	resourceId: string
	showConfig: ShowConfig | undefined
	open: boolean
	onOpenChange: (open: boolean) => void
}

function emptyTab(): Pick<ShowTab, 'label' | 'showLabel' | 'description'> & {
	groups: ShowTab['groups']
} {
	return {
		label: 'New tab',
		showLabel: 'New tab',
		description: '',
		groups: [
			{
				columns: 1,
				columnItems: [[]],
				showLabel: true
			}
		]
	}
}

function SortableTabRow({
	tab,
	index,
	onEdit,
	onDelete
}: {
	tab: Pick<ShowTab, 'label' | 'showLabel' | 'description'>
	index: number
	onEdit: () => void
	onDelete: () => void
}) {
	const id = `tabs:${index}`
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}
	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-2 rounded-lg border p-2 transition-colors hover:bg-muted/10 hover:border-primary cursor-pointer ${
				isDragging ? 'opacity-50' : ''
			}`}
			onClick={onEdit}
		>
			<button
				type='button'
				className='touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded'
				{...attributes}
				{...listeners}
				aria-label='Drag to reorder'
				onClick={e => e.stopPropagation()}
			>
				<GripVertical className='h-4 w-4' />
			</button>
			<div className='flex-1 text-left text-sm font-medium truncate'>{tab.label}</div>
			<Button
				variant='ghost'
				size='icon'
				className='h-8 w-8 shrink-0'
				onClick={e => {
					e.stopPropagation()
					onDelete()
				}}
			>
				<Trash2 className='h-3.5 w-3.5 text-destructive' />
			</Button>
		</div>
	)
}

export function ShowTabsEditor({
	resourceId,
	showConfig,
	open,
	onOpenChange
}: ShowTabsEditorProps) {
	const updateMutation = useUpdateShowConfig(resourceId)
	const existingTabs = showConfig?.tabs ?? []

	const [showTabs, setShowTabs] = useState(true)
	const [tabs, setTabs] = useState<
		Array<Pick<ShowTab, 'label' | 'showLabel' | 'description'> & { groups: ShowTab['groups'] }>
	>([])
	const [editingTab, setEditingTab] = useState<{
		index: number
		label: string
		showLabel: string
		description: string
	} | null>(null)

	const prevOpenRef = useRef(false)
	useEffect(() => {
		if (open && !prevOpenRef.current) {
			prevOpenRef.current = true
			setShowTabs(showConfig?.showTabs ?? true)
			setTabs(
				existingTabs.length > 0
					? existingTabs.map(tab => ({
							label: tab.label,
							showLabel: tab.showLabel ?? tab.label,
							description: tab.description ?? '',
							groups: tab.groups ?? []
					  }))
					: []
			)
			setEditingTab(null)
		}
		if (!open) prevOpenRef.current = false
	}, [open, showConfig?.showTabs, existingTabs])

	const initState = useCallback(() => {
		setShowTabs(showConfig?.showTabs ?? true)
		setTabs(
			existingTabs.length > 0
				? existingTabs.map(tab => ({
						label: tab.label,
						showLabel: tab.showLabel ?? tab.label,
						description: tab.description ?? '',
						groups: tab.groups ?? []
				  }))
				: []
		)
		setEditingTab(null)
	}, [showConfig?.showTabs, existingTabs])

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor)
	)

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			initState()
		}
		onOpenChange(next)
	}

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const a = String(active.id)
		const o = String(over.id)
		if (!a.startsWith('tabs:') || !o.startsWith('tabs:')) return
		const from = Number(a.split(':')[1])
		const to = Number(o.split(':')[1])
		if (Number.isNaN(from) || Number.isNaN(to)) return
		setTabs(prev => arrayMove(prev, from, to))
	}, [])

	const addTab = () => {
		const newTab = emptyTab()
		setTabs(prev => [...prev, newTab])
		setEditingTab({
			index: tabs.length,
			label: newTab.label,
			showLabel: newTab.showLabel ?? newTab.label,
			description: newTab.description ?? ''
		})
	}

	const updateTab = (index: number, label: string, showLabel: string, description: string) => {
		setTabs(prev => {
			const next = [...prev]
			const t = next[index]
			if (t) next[index] = { ...t, label, showLabel, description }
			return next
		})
		setEditingTab(null)
	}

	const deleteTab = (index: number) => {
		setTabs(prev => prev.filter((_, i) => i !== index))
	}

	const handleSave = async () => {
		const mergedTabs: ShowTab[] = tabs.map((t, i) => {
			const existing = existingTabs[i]
			return {
				label: t.label,
				showLabel: t.showLabel || t.label,
				description: t.description || undefined,
				groups: existing?.groups ?? t.groups ?? []
			}
		})
		try {
			await updateMutation.mutateAsync({ showTabs, tabs: mergedTabs })
			handleOpenChange(false)
		} catch (err) {
			console.error('Error saving tabs configuration:', err)
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className='sm:max-w-[1000px] max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Tabs configuration</DialogTitle>
						<DialogDescription>
							Choose whether to show tabs and configure tab labels.
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-6 py-4'>
						<Field orientation='horizontal'>
							<FieldContent>
								<FieldLabel htmlFor='showTabs'>Show tabs</FieldLabel>
								<FieldDescription>
									Display tabs to organize content into multiple sections.
								</FieldDescription>
							</FieldContent>
							<Switch
								id='showTabs'
								checked={showTabs}
								onCheckedChange={v => setShowTabs(v === true)}
							/>
						</Field>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<Label>Tabs</Label>
								<Button type='button' variant='outline' size='sm' onClick={addTab}>
									<Plus className='h-4 w-4 mr-1' />
									Add tab
								</Button>
							</div>
							{tabs.length === 0 ? (
								<Card className='p-6 border-dashed text-center text-muted-foreground text-sm'>
									No tabs. Add a tab to show multiple sections.
								</Card>
							) : (
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragEnd={handleDragEnd}
									modifiers={[restrictToVerticalAxis]}
								>
									<SortableContext
										strategy={verticalListSortingStrategy}
										items={tabs.map((_, i) => `tabs:${i}`)}
									>
										<div className='space-y-1'>
											{tabs.map((tab, i) => (
												<SortableTabRow
													key={i}
													tab={tab}
													index={i}
													onEdit={() =>
														setEditingTab({
															index: i,
															label: tab.label,
															showLabel: tab.showLabel ?? tab.label,
															description: tab.description ?? ''
														})
													}
													onDelete={() => deleteTab(i)}
												/>
											))}
										</div>
									</SortableContext>
								</DndContext>
							)}
						</div>
					</div>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => handleOpenChange(false)}
							disabled={updateMutation.isPending}
						>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={updateMutation.isPending}>
							{updateMutation.isPending && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{editingTab && (
				<EditTabModal
					open={true}
					onOpenChange={open => !open && setEditingTab(null)}
					index={editingTab.index}
					label={editingTab.label}
					showLabel={editingTab.showLabel}
					description={editingTab.description}
					onSave={(l, s, d) => {
						updateTab(editingTab.index, l, s, d)
						setEditingTab(null)
					}}
				/>
			)}
		</>
	)
}

// Inline edit tab form (nested dialog)
function EditTabModal({
	open,
	onOpenChange,
	label,
	showLabel,
	description,
	onSave
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	index: number
	label: string
	showLabel: string
	description: string
	onSave: (label: string, showLabel: string, description: string) => void
}) {
	const [l, setL] = useState(label)
	const [showHeading, setShowHeading] = useState(!!showLabel)
	const [d, setD] = useState(description)
	useEffect(() => {
		if (open) {
			setL(label)
			setShowHeading(!!showLabel)
			setD(description)
		}
	}, [open, label, showLabel, description])
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>Edit tab</DialogTitle>
					<DialogDescription>
						Configure tab label, heading, and description.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-6 py-4'>
					{/* Tab Label */}
					<div className='grid gap-2'>
						<Label htmlFor='tab-label'>Tab label</Label>
						<InputGroup>
							<InputGroupInput
								id='tab-label'
								value={l}
								onChange={e => setL(e.target.value)}
								placeholder='e.g. Overview'
							/>
						</InputGroup>
					</div>

					{/* Show Heading Toggle */}
					<Field orientation='horizontal'>
						<FieldContent>
							<FieldLabel htmlFor='showHeading'>Show card heading</FieldLabel>
							<FieldDescription>
								Display the tab label as a heading in the card content.
							</FieldDescription>
						</FieldContent>
						<Switch
							id='showHeading'
							checked={showHeading}
							onCheckedChange={setShowHeading}
						/>
					</Field>

					{/* Description */}
					<div className='grid gap-2'>
						<Label htmlFor='tab-description'>Description (optional)</Label>
						<InputGroup>
							<InputGroupInput
								id='tab-description'
								value={d}
								onChange={e => setD(e.target.value)}
								placeholder='Short description'
							/>
						</InputGroup>
					</div>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							onSave(l || 'Tab', showHeading ? l : '', d)
							onOpenChange(false)
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
