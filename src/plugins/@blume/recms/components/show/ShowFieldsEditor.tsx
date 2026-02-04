'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, GripVertical, Plus, Trash2, Pencil } from 'lucide-react'
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
import type {
	ListConfig,
	ShowConfig,
	ShowTab,
	ShowGroup,
	ShowItem,
	ShowItemType
} from '../../types'

export interface ShowFieldsEditorProps {
	resourceId: string
	listConfig: ListConfig | undefined
	showConfig: ShowConfig | undefined
	/** Index of the tab whose groups are being edited (tab must exist). */
	tabIndex: number
	open: boolean
	onOpenChange: (open: boolean) => void
}

const SHOW_ITEM_TYPES: ShowItemType[] = ['text', 'number', 'date', 'richtext']

function emptyGroup(): ShowGroup {
	return { label: 'New group', columns: 1, columnItems: [[]] }
}

function getColumnItems(group: ShowGroup): ShowItem[][] {
	if (group.columnItems && group.columnItems.length > 0) return group.columnItems
	const cols = group.columns ?? 1
	return Array.from({ length: cols }, () => [])
}

function emptyItem(field: string, type: ShowItemType = 'text'): ShowItem {
	return { field, type }
}

// ---- Sortable group row ----
function SortableGroupRow({
	group,
	index,
	onSelect,
	onEdit,
	onDelete,
	isSelected
}: {
	group: ShowGroup
	index: number
	onSelect: () => void
	onEdit: () => void
	onDelete: () => void
	isSelected: boolean
}) {
	const id = `groups:${index}`
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}
	const label = group.label ?? group.name ?? 'Group'
	const cols = group.columns ?? 1
	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${
				isSelected ? 'border-primary bg-muted/50' : 'border-border bg-card'
			} ${isDragging ? 'opacity-50' : ''}`}
		>
			<button
				type='button'
				className='touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded'
				{...attributes}
				{...listeners}
				aria-label='Drag to reorder'
			>
				<GripVertical className='h-4 w-4' />
			</button>
			<button type='button' className='flex-1 text-left text-sm truncate' onClick={onSelect}>
				<span className='font-medium'>{label}</span>
				<span className='text-muted-foreground ml-1'>({cols} col)</span>
			</button>
			<Button
				variant='ghost'
				size='icon'
				className='h-8 w-8 shrink-0'
				onClick={e => {
					e.stopPropagation()
					onEdit()
				}}
			>
				<Pencil className='h-3.5 w-3.5' />
			</Button>
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

// ---- Sortable item row ----
function SortableItemRow({
	item,
	index,
	fieldLabel,
	onEdit,
	onDelete
}: {
	item: ShowItem
	index: number
	fieldLabel: string
	onEdit: () => void
	onDelete: () => void
}) {
	const id = `items:${index}`
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}
	const label = item.label ?? fieldLabel
	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-2 rounded-md border border-border bg-card p-2 ${
				isDragging ? 'opacity-50' : ''
			}`}
		>
			<button
				type='button'
				className='touch-none cursor-grab active:cursor-grabbing text-muted-foreground p-0.5 rounded'
				{...attributes}
				{...listeners}
				aria-label='Drag to reorder'
			>
				<GripVertical className='h-3.5 w-3.5' />
			</button>
			<button
				type='button'
				className='flex-1 text-left text-sm truncate min-w-0'
				onClick={onEdit}
			>
				{label}
			</button>
			<span className='text-xs text-muted-foreground shrink-0'>{item.type}</span>
			<Button variant='ghost' size='icon' className='h-7 w-7 shrink-0' onClick={onEdit}>
				<Pencil className='h-3 w-3' />
			</Button>
			<Button variant='ghost' size='icon' className='h-7 w-7 shrink-0' onClick={onDelete}>
				<Trash2 className='h-3 w-3 text-destructive' />
			</Button>
		</div>
	)
}

function deepCloneGroups(groups: ShowGroup[]): ShowGroup[] {
	return groups.map(g => ({
		...g,
		columnItems: g.columnItems?.map(col => [...col]) ?? []
	}))
}

export function ShowFieldsEditor({
	resourceId,
	listConfig,
	showConfig,
	tabIndex,
	open,
	onOpenChange
}: ShowFieldsEditorProps) {
	const updateMutation = useUpdateShowConfig(resourceId)
	const listColumns = listConfig?.columns ?? []

	const existingTabs = showConfig?.tabs ?? []
	const [groups, setGroups] = useState<ShowGroup[]>([])
	const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)

	// Sync groups when dialog opens or tabIndex changes
	useEffect(() => {
		if (!open) return
		const tab = existingTabs[tabIndex]
		setGroups(tab ? deepCloneGroups(tab.groups ?? []) : [])
		setSelectedGroupIndex(0)
	}, [open, tabIndex, existingTabs])

	// Edit modals state
	const [editingGroup, setEditingGroup] = useState<{
		groupIndex: number
		group: ShowGroup
	} | null>(null)
	const [editingItem, setEditingItem] = useState<{
		groupIndex: number
		colIndex: number
		itemIndex: number
		item: ShowItem
	} | null>(null)
	const [addingItemTo, setAddingItemTo] = useState<{
		groupIndex: number
		colIndex: number
	} | null>(null)

	const handleDialogChange = useCallback(
		(next: boolean) => {
			if (!next) setSelectedGroupIndex(0)
			onOpenChange(next)
		},
		[onOpenChange]
	)

	const handleSave = async () => {
		try {
			const nextTabs = existingTabs.map((tab, i) =>
				i === tabIndex ? { ...tab, groups } : tab
			)
			await updateMutation.mutateAsync({ tabs: nextTabs })
			onOpenChange(false)
		} catch (err) {
			console.error('Error saving content configuration:', err)
		}
	}

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor)
	)

	// Drag end: groups
	const handleGroupsDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const a = String(active.id)
		const o = String(over.id)
		if (!a.startsWith('groups:') || !o.startsWith('groups:')) return
		const from = Number(a.split(':')[1])
		const to = Number(o.split(':')[1])
		if (Number.isNaN(from) || Number.isNaN(to)) return
		setGroups(prev => arrayMove(prev, from, to))
		setSelectedGroupIndex(to)
	}, [])

	// Drag end: items in one column
	const handleItemsDragEnd = useCallback(
		(event: DragEndEvent, colIndex: number) => {
			const { active, over } = event
			if (!over || active.id === over.id) return
			const a = String(active.id)
			const o = String(over.id)
			if (!a.startsWith('items:') || !o.startsWith('items:')) return
			const from = Number(a.split(':')[1])
			const to = Number(o.split(':')[1])
			if (Number.isNaN(from) || Number.isNaN(to)) return
			setGroups(prev => {
				const next = [...prev]
				const group = next[selectedGroupIndex]
				if (!group) return prev
				const columnItems = getColumnItems(group).map((col, i) =>
					i === colIndex ? arrayMove(col, from, to) : col
				)
				next[selectedGroupIndex] = { ...group, columnItems }
				return next
			})
		},
		[selectedGroupIndex]
	)

	const currentGroup = groups[selectedGroupIndex]

	const addGroup = () => {
		const newGroup = emptyGroup()
		setGroups(prev => [...prev, newGroup])
		setSelectedGroupIndex(groups.length)
		setEditingGroup({
			groupIndex: groups.length,
			group: newGroup
		})
	}

	const updateGroup = (groupIndex: number, group: ShowGroup) => {
		setGroups(prev => {
			const next = [...prev]
			next[groupIndex] = group
			return next
		})
		setEditingGroup(null)
	}

	const deleteGroup = (groupIndex: number) => {
		setGroups(prev => prev.filter((_, i) => i !== groupIndex))
		setSelectedGroupIndex(i => (i >= groupIndex && i > 0 ? i - 1 : i === groupIndex ? 0 : i))
	}

	const addItemToColumn = (groupIndex: number, colIndex: number) => {
		setAddingItemTo({ groupIndex, colIndex })
	}

	const commitAddItem = (field: string, type: ShowItemType, label?: string) => {
		if (!addingItemTo) return
		const { groupIndex, colIndex } = addingItemTo
		const newItem = emptyItem(field, type)
		if (label?.trim()) newItem.label = label.trim()
		setGroups(prev => {
			const next = [...prev]
			const group = next[groupIndex]
			if (!group) return prev
			const columnItems = getColumnItems(group).map((col, i) =>
				i === colIndex ? [...col, newItem] : col
			)
			next[groupIndex] = { ...group, columnItems }
			return next
		})
		setAddingItemTo(null)
	}

	const updateItem = (
		groupIndex: number,
		colIndex: number,
		itemIndex: number,
		item: ShowItem
	) => {
		setGroups(prev => {
			const next = [...prev]
			const group = next[groupIndex]
			if (!group) return prev
			const columnItems = getColumnItems(group).map((col, i) =>
				i === colIndex ? col.map((it, j) => (j === itemIndex ? item : it)) : col
			)
			next[groupIndex] = { ...group, columnItems }
			return next
		})
		setEditingItem(null)
	}

	const deleteItem = (groupIndex: number, colIndex: number, itemIndex: number) => {
		setGroups(prev => {
			const next = [...prev]
			const group = next[groupIndex]
			if (!group) return prev
			const columnItems = getColumnItems(group).map((col, i) =>
				i === colIndex ? col.filter((_, j) => j !== itemIndex) : col
			)
			next[groupIndex] = { ...group, columnItems }
			return next
		})
	}

	const fieldLabels = useMemo(
		() => new Map(listColumns.map(c => [c.field, c.label])),
		[listColumns]
	)

	// Ensure columnItems has right number of columns when group.columns changes
	const normalizeGroupColumnItems = (group: ShowGroup): ShowItem[][] => {
		const cols = group.columns ?? 1
		const current = getColumnItems(group)
		const result: ShowItem[][] = []
		for (let i = 0; i < cols; i++) result.push(current[i] ? [...current[i]] : [])
		return result
	}

	return (
		<>
			<Dialog open={open} onOpenChange={handleDialogChange}>
				<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Content configuration</DialogTitle>
						<DialogDescription>
							Configure groups and fields for this tab. Add a group first, then add
							fields to it.
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-6 py-4'>
						{/* Groups */}
						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<Label>Groups</Label>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={addGroup}
								>
									<Plus className='h-4 w-4 mr-1' />
									Add group
								</Button>
							</div>
							{groups.length === 0 ? (
								<Card className='p-4 border-dashed text-center text-muted-foreground text-sm'>
									No groups. Add a group to organize fields.
								</Card>
							) : (
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragEnd={handleGroupsDragEnd}
									modifiers={[restrictToVerticalAxis]}
								>
									<SortableContext
										strategy={verticalListSortingStrategy}
										items={groups.map((_, i) => `groups:${i}`)}
									>
										<div className='space-y-1'>
											{groups.map((group, i) => (
												<SortableGroupRow
													key={i}
													group={group}
													index={i}
													isSelected={selectedGroupIndex === i}
													onSelect={() => setSelectedGroupIndex(i)}
													onEdit={() =>
														setEditingGroup({
															groupIndex: i,
															group: {
																...group,
																columnItems: getColumnItems(
																	group
																).map(c => [...c])
															}
														})
													}
													onDelete={() => deleteGroup(i)}
												/>
											))}
										</div>
									</SortableContext>
								</DndContext>
							)}
						</div>

						{/* Fields (for selected group) - columns */}
						{currentGroup && (
							<div className='space-y-3'>
								<Label>
									Fields in &quot;
									{currentGroup.label ?? currentGroup.name ?? 'Group'}&quot;
								</Label>
								<div
									className='grid gap-4'
									style={{
										gridTemplateColumns: `repeat(${
											currentGroup.columns ?? 1
										}, minmax(0, 1fr))`
									}}
								>
									{Array.from(
										{ length: currentGroup.columns ?? 1 },
										(_, colIndex) => {
											const items =
												getColumnItems(currentGroup)[colIndex] ?? []
											return (
												<Card key={colIndex} className='p-3'>
													<CardHeader className='p-0 pb-2'>
														<CardTitle className='text-sm'>
															Column {colIndex + 1}
														</CardTitle>
													</CardHeader>
													<CardContent className='p-0 space-y-2'>
														<DndContext
															key={`items-${selectedGroupIndex}-${colIndex}`}
															sensors={sensors}
															collisionDetection={closestCenter}
															onDragEnd={e =>
																handleItemsDragEnd(e, colIndex)
															}
															modifiers={[restrictToVerticalAxis]}
														>
															<SortableContext
																strategy={
																	verticalListSortingStrategy
																}
																items={items.map(
																	(_, i) => `items:${i}`
																)}
															>
																{items.map((item, itemIndex) => (
																	<SortableItemRow
																		key={`${item.field}-${itemIndex}`}
																		item={item}
																		index={itemIndex}
																		fieldLabel={
																			fieldLabels.get(
																				item.field
																			) ?? item.field
																		}
																		onEdit={() =>
																			setEditingItem({
																				groupIndex:
																					selectedGroupIndex,
																				colIndex,
																				itemIndex,
																				item: { ...item }
																			})
																		}
																		onDelete={() =>
																			deleteItem(
																				selectedGroupIndex,
																				colIndex,
																				itemIndex
																			)
																		}
																	/>
																))}
															</SortableContext>
														</DndContext>
														{addingItemTo?.groupIndex ===
															selectedGroupIndex &&
														addingItemTo?.colIndex === colIndex ? (
															<AddItemInline
																listColumns={listColumns}
																onAdd={(field, type, label) => {
																	commitAddItem(
																		field,
																		type,
																		label
																	)
																}}
																onCancel={() =>
																	setAddingItemTo(null)
																}
															/>
														) : (
															<Button
																type='button'
																variant='ghost'
																size='sm'
																className='w-full mt-1'
																onClick={() =>
																	setAddingItemTo({
																		groupIndex:
																			selectedGroupIndex,
																		colIndex
																	})
																}
															>
																<Plus className='h-4 w-4 mr-1' />
																Add field
															</Button>
														)}
													</CardContent>
												</Card>
											)
										}
									)}
								</div>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
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

			{/* Edit group modal */}
			<Dialog open={!!editingGroup} onOpenChange={open => !open && setEditingGroup(null)}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Edit group</DialogTitle>
						<DialogDescription>Group heading and layout.</DialogDescription>
					</DialogHeader>
					{editingGroup && (
						<EditGroupForm
							group={editingGroup.group}
							onSave={group => {
								const normalized = {
									...group,
									columnItems: normalizeGroupColumnItems(group)
								}
								updateGroup(editingGroup.groupIndex, normalized)
							}}
							onCancel={() => setEditingGroup(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit item modal */}
			<Dialog open={!!editingItem} onOpenChange={open => !open && setEditingItem(null)}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Edit field</DialogTitle>
						<DialogDescription>Display type and label override.</DialogDescription>
					</DialogHeader>
					{editingItem && currentGroup && (
						<EditItemForm
							item={editingItem.item}
							listColumns={listColumns}
							groupColumns={currentGroup.columns ?? 1}
							onSave={item =>
								updateItem(
									editingItem.groupIndex,
									editingItem.colIndex,
									editingItem.itemIndex,
									item
								)
							}
							onCancel={() => setEditingItem(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}

// ---- Inline add field ----
function AddItemInline({
	listColumns,
	onAdd,
	onCancel
}: {
	listColumns: { field: string; label: string }[]
	onAdd: (field: string, type: ShowItemType, label?: string) => void
	onCancel: () => void
}) {
	const [field, setField] = useState('')
	const [type, setType] = useState<ShowItemType>('text')
	const [label, setLabel] = useState('')
	const options = listColumns.filter(c => c.field)
	if (options.length === 0) {
		return (
			<div className='rounded-md border border-dashed p-2 text-sm text-muted-foreground'>
				No list columns. Configure list columns first.
			</div>
		)
	}
	const handleAdd = () => {
		if (field) {
			onAdd(field, type, label.trim() || undefined)
			setField('')
			setLabel('')
			setType('text')
		}
	}
	return (
		<div className='rounded-md border border-dashed p-2 space-y-2'>
			<Select value={field} onValueChange={setField}>
				<SelectTrigger className='h-8'>
					<SelectValue placeholder='Select field' />
				</SelectTrigger>
				<SelectContent>
					{options.map(c => (
						<SelectItem key={c.field} value={c.field}>
							{c.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select value={type} onValueChange={v => setType(v as ShowItemType)}>
				<SelectTrigger className='h-8'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{SHOW_ITEM_TYPES.map(t => (
						<SelectItem key={t} value={t}>
							{t}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Input
				placeholder='Label override (optional)'
				className='h-8'
				value={label}
				onChange={e => setLabel(e.target.value)}
			/>
			<div className='flex gap-1'>
				<Button type='button' size='sm' onClick={handleAdd} disabled={!field}>
					Add
				</Button>
				<Button type='button' size='sm' variant='ghost' onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</div>
	)
}

function EditGroupForm({
	group,
	onSave,
	onCancel
}: {
	group: ShowGroup
	onSave: (g: ShowGroup) => void
	onCancel: () => void
}) {
	const [label, setLabel] = useState(group.label ?? group.name ?? '')
	const [description, setDescription] = useState(group.description ?? '')
	const [columns, setColumns] = useState(String(group.columns ?? 1))
	const cols = Math.min(8, Math.max(1, parseInt(columns, 10) || 1))
	return (
		<div className='grid gap-4 py-4'>
			<div className='grid gap-2'>
				<Label>Group label</Label>
				<Input
					value={label}
					onChange={e => setLabel(e.target.value)}
					placeholder='e.g. Basic info'
				/>
			</div>
			<div className='grid gap-2'>
				<Label>Description (optional)</Label>
				<Input
					value={description}
					onChange={e => setDescription(e.target.value)}
					placeholder='Short description'
				/>
			</div>
			<div className='grid gap-2'>
				<Label>Columns (1–8)</Label>
				<Input
					type='number'
					min={1}
					max={8}
					value={columns}
					onChange={e => setColumns(e.target.value)}
				/>
			</div>
			<DialogFooter>
				<Button variant='outline' onClick={onCancel}>
					Cancel
				</Button>
				<Button
					onClick={() =>
						onSave({
							...group,
							label: label || undefined,
							name: label || undefined,
							description: description || undefined,
							columns: cols
						})
					}
				>
					Save
				</Button>
			</DialogFooter>
		</div>
	)
}

function EditItemForm({
	item,
	listColumns,
	groupColumns,
	onSave,
	onCancel
}: {
	item: ShowItem
	listColumns: { field: string; label: string }[]
	groupColumns: number
	onSave: (item: ShowItem) => void
	onCancel: () => void
}) {
	const [field, setField] = useState(item.field)
	const [type, setType] = useState<ShowItemType>(item.type)
	const [label, setLabel] = useState(item.label ?? '')
	const [colspan, setColspan] = useState(String(item.colspan ?? 1))
	const options = listColumns
	const colspanNum = Math.min(groupColumns, Math.max(1, parseInt(colspan, 10) || 1))
	return (
		<div className='grid gap-4 py-4'>
			<div className='grid gap-2'>
				<Label>Field</Label>
				<Select value={field} onValueChange={setField}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{options.map(c => (
							<SelectItem key={c.field} value={c.field}>
								{c.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='grid gap-2'>
				<Label>Type</Label>
				<Select value={type} onValueChange={v => setType(v as ShowItemType)}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{SHOW_ITEM_TYPES.map(t => (
							<SelectItem key={t} value={t}>
								{t}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='grid gap-2'>
				<Label>Label override (optional)</Label>
				<Input
					value={label}
					onChange={e => setLabel(e.target.value)}
					placeholder='Leave empty to use column label'
				/>
			</div>
			<div className='grid gap-2'>
				<Label>Colspan (1–{groupColumns})</Label>
				<Input
					type='number'
					min={1}
					max={groupColumns}
					value={colspan}
					onChange={e => setColspan(e.target.value)}
					placeholder='1'
				/>
				<p className='text-sm text-muted-foreground'>
					Number of columns this field spans in the group grid.
				</p>
			</div>
			<DialogFooter>
				<Button variant='outline' onClick={onCancel}>
					Cancel
				</Button>
				<Button
					onClick={() =>
						onSave({
							field,
							type,
							label: label.trim() || undefined,
							colspan: colspanNum > 1 ? colspanNum : undefined
						})
					}
				>
					Save
				</Button>
			</DialogFooter>
		</div>
	)
}
