'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
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
import { Label } from '@/components/ui/label'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupTextarea
} from '@/components/ui/input-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Loader2, Plus, Trash2, GripVertical, ChevronRight, Columns } from 'lucide-react'
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
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Field, FieldContent, FieldLabel, FieldDescription } from '@/components/ui/field'
import { useUpdateShowConfig } from '../../hooks'
import type { ShowConfig, ShowTab, ShowGroup, ShowItem } from '../../types'
import { FieldItemEditor } from './fields-editor'

// ---- Field Extraction Types ----
interface FieldOption {
	value: string // Full path like "user.profile.name"
	label: string // Display label like "User › Profile › Name"
	path: string[] // Array of path segments
	type: 'primitive' | 'object' | 'array'
}

interface FieldGroup {
	value: string // Group name like "Root", "User", "Address"
	items: FieldOption[]
}

// ---- Field Extraction Helpers ----
function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function extractFields(obj: unknown, prefix: string[] = [], maxDepth = 10): FieldOption[] {
	if (maxDepth <= 0) return []
	if (obj === null || obj === undefined) return []

	const fields: FieldOption[] = []

	if (Array.isArray(obj)) {
		// For arrays, inspect the first item if available
		if (obj.length > 0) {
			const arrayFields = extractFields(obj[0], prefix, maxDepth - 1)
			fields.push(...arrayFields)
		}
		return fields
	}

	if (typeof obj === 'object') {
		const entries = Object.entries(obj)

		for (const [key, value] of entries) {
			const currentPath = [...prefix, key]
			const fullPath = currentPath.join('.')
			const label = currentPath.map(p => capitalize(p)).join(' › ')

			// Determine the type
			let fieldType: FieldOption['type'] = 'primitive'
			if (value !== null && typeof value === 'object') {
				fieldType = Array.isArray(value) ? 'array' : 'object'
			}

			// Add the current field
			fields.push({
				value: fullPath,
				label,
				path: currentPath,
				type: fieldType
			})

			// Recursively extract nested fields
			if (value !== null && typeof value === 'object') {
				const nestedFields = extractFields(value, currentPath, maxDepth - 1)
				fields.push(...nestedFields)
			}
		}
	}

	return fields
}

function groupFields(fields: FieldOption[]): FieldGroup[] {
	const groups = new Map<string, FieldOption[]>()

	for (const field of fields) {
		const groupName = field.path.length === 1 ? 'Root' : capitalize(field.path[0])
		const existing = groups.get(groupName) || []
		existing.push(field)
		groups.set(groupName, existing)
	}

	return Array.from(groups.entries()).map(([value, items]) => ({
		value,
		items: items.sort((a, b) => a.value.localeCompare(b.value))
	}))
}

export interface ShowFieldsEditorProps {
	resourceId: string
	showConfig: ShowConfig | undefined
	/** The current record being viewed */
	record: Record<string, unknown> | null
	/** Index of the tab to edit (optional, defaults to 0) */
	tabIndex?: number
	open: boolean
	onOpenChange: (open: boolean) => void
}

function deepCloneGroups(groups: ShowGroup[]): ShowGroup[] {
	return groups.map(g => ({
		...g,
		columnItems: g.columnItems?.map(col => [...col]) ?? []
	}))
}

function deepCloneTabs(tabs: ShowTab[]): ShowTab[] {
	return tabs.map(tab => ({
		...tab,
		groups: deepCloneGroups(tab.groups ?? [])
	}))
}

export function ShowFieldsEditor({
	resourceId,
	showConfig,
	record,
	tabIndex = 0,
	open,
	onOpenChange
}: ShowFieldsEditorProps) {
	const updateMutation = useUpdateShowConfig(resourceId)

	// Extract fields from the current record
	const fieldGroups = useMemo(() => {
		if (!record || typeof record !== 'object') {
			return []
		}
		const fields = extractFields(record)
		return groupFields(fields)
	}, [record])

	const isLoadingFields = false

	// Store only the changes/edits, not the full tabs array
	const [editedGroups, setEditedGroups] = useState<Map<number, ShowGroup[]>>(new Map())
	const [selectedTabIndex, setSelectedTabIndex] = useState(tabIndex)

	// Derive the working tabs from showConfig and apply any edits
	const tabs = useMemo(() => {
		const base = deepCloneTabs(showConfig?.tabs ?? [])
		editedGroups.forEach((groups, index) => {
			if (base[index]) {
				base[index] = { ...base[index], groups }
			}
		})
		return base
	}, [showConfig?.tabs, editedGroups])

	const handleDialogOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			// Clear edits when closing
			setEditedGroups(new Map())
		}
		onOpenChange(isOpen)
	}

	const handleSave = async () => {
		try {
			await updateMutation.mutateAsync({ tabs })
			handleDialogOpenChange(false)
		} catch (err) {
			console.error('Error saving content configuration:', err)
		}
	}

	const updateGroups = (newGroups: ShowGroup[]) => {
		setEditedGroups(prev => {
			const next = new Map(prev)
			next.set(selectedTabIndex, newGroups)
			return next
		})
	}

	// Check if there are any tabs in the config (not just local state)
	const existingTabs = showConfig?.tabs ?? []
	if (existingTabs.length === 0) {
		return (
			<Dialog open={open} onOpenChange={handleDialogOpenChange}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Content configuration</DialogTitle>
						<DialogDescription>
							No tabs available. Create a tab first.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant='outline' onClick={() => handleDialogOpenChange(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}

	// Use existingTabs for display if tabs state is not yet initialized
	const displayTabs = tabs.length > 0 ? tabs : existingTabs
	const currentTab = displayTabs[selectedTabIndex]
	const groups = currentTab?.groups ?? []

	return (
		<Dialog open={open} onOpenChange={handleDialogOpenChange}>
			<DialogContent className='sm:max-w-screen-xl max-h-[95vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Content configuration</DialogTitle>
					<DialogDescription>
						Configure groups and fields for the selected tab. Each group can contain
						multiple field items.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 py-4'>
					{/* Tab Selection */}
					<div className='space-y-2'>
						<Label>Content configuration for tab</Label>
						<Select
							value={String(selectedTabIndex)}
							onValueChange={v => setSelectedTabIndex(Number(v))}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{displayTabs.map((tab, i) => (
									<SelectItem key={i} value={String(i)}>
										{tab.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Separator />

					{/* Groups Management */}
					<GroupsSection
						groups={groups}
						fieldGroups={fieldGroups}
						isLoadingFields={isLoadingFields}
						onGroupsChange={updateGroups}
					/>
				</div>

				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => handleDialogOpenChange(false)}
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
	)
}

// ---- Groups Section ----
interface GroupsSectionProps {
	groups: ShowGroup[]
	fieldGroups: Array<{ value: string; items: Array<{ value: string; label: string }> }>
	isLoadingFields: boolean
	onGroupsChange: (groups: ShowGroup[]) => void
}

function GroupsSection({
	groups,
	fieldGroups,
	isLoadingFields,
	onGroupsChange
}: GroupsSectionProps) {
	const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]))
	const [editingItem, setEditingItem] = useState<{
		groupIndex: number
		colIndex: number
		itemIndex: number
		item: ShowItem
	} | null>(null)

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor)
	)

	const handleGroupsDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const a = String(active.id)
		const o = String(over.id)
		if (!a.startsWith('group:') || !o.startsWith('group:')) return
		const from = Number(a.split(':')[1])
		const to = Number(o.split(':')[1])
		if (Number.isNaN(from) || Number.isNaN(to)) return
		onGroupsChange(arrayMove(groups, from, to))
		// Update expanded groups indices after reorder
		setExpandedGroups(prev => {
			const next = new Set<number>()
			prev.forEach(i => {
				if (i === from) next.add(to)
				else if (i > from && i <= to) next.add(i - 1)
				else if (i < from && i >= to) next.add(i + 1)
				else next.add(i)
			})
			return next
		})
	}

	const toggleGroup = (index: number) => {
		setExpandedGroups(prev => {
			const next = new Set(prev)
			if (next.has(index)) {
				next.delete(index)
			} else {
				next.add(index)
			}
			return next
		})
	}

	const addGroup = () => {
		const newGroup: ShowGroup = {
			columns: 1,
			columnItems: [[]],
			showLabel: true
		}
		onGroupsChange([...groups, newGroup])
		setExpandedGroups(prev => new Set(prev).add(groups.length))
	}

	const updateGroup = (index: number, group: ShowGroup) => {
		const next = [...groups]
		next[index] = group
		onGroupsChange(next)
	}

	const deleteGroup = (index: number) => {
		onGroupsChange(groups.filter((_, i) => i !== index))
		setExpandedGroups(prev => {
			const next = new Set(prev)
			next.delete(index)
			// Adjust indices for groups after the deleted one
			const adjusted = new Set<number>()
			next.forEach(i => {
				if (i > index) adjusted.add(i - 1)
				else if (i < index) adjusted.add(i)
			})
			return adjusted
		})
	}

	return (
		<>
			<div className='space-y-4'>
				{/* Groups List */}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<Label>Groups</Label>
						<Button type='button' variant='outline' size='sm' onClick={addGroup}>
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
								items={groups.map((_, i) => `group:${i}`)}
							>
								<div className='space-y-2 flex flex-col'>
									{groups.map((group, i) => (
										<SortableGroupRow
											key={i}
											group={group}
											index={i}
											isExpanded={expandedGroups.has(i)}
											onToggle={() => toggleGroup(i)}
											onUpdate={updatedGroup => updateGroup(i, updatedGroup)}
											onDelete={() => deleteGroup(i)}
											fieldGroups={fieldGroups}
											isLoadingFields={isLoadingFields}
											onEditItem={item =>
												setEditingItem({ ...item, groupIndex: i })
											}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>
					)}
				</div>
			</div>

			{/* Edit/Add Item Dialog */}
			{editingItem && (
				<FieldItemEditor
					item={editingItem.item}
					fieldGroups={fieldGroups}
					maxColumns={groups[editingItem.groupIndex]?.columns ?? 1}
					open={!!editingItem}
					onOpenChange={(isOpen: boolean) => !isOpen && setEditingItem(null)}
					onSave={(updatedItem: ShowItem) => {
						const { groupIndex, colIndex, itemIndex } = editingItem
						const group = groups[groupIndex]
						if (!group) return

						// If itemIndex is -1, we're adding a new item
						if (itemIndex === -1) {
							const columnItems = getColumnItems(group).map((col, i) =>
								i === colIndex ? [...col, updatedItem] : col
							)
							updateGroup(groupIndex, { ...group, columnItems })
						} else {
							// Otherwise, we're editing an existing item
							const columnItems = getColumnItems(group).map((col, i) =>
								i === colIndex
									? col.map((it, j) => (j === itemIndex ? updatedItem : it))
									: col
							)
							updateGroup(groupIndex, { ...group, columnItems })
						}
						setEditingItem(null)
					}}
				/>
			)}
		</>
	)
}

// ---- Sortable Group Row ----
interface SortableGroupRowProps {
	group: ShowGroup
	index: number
	isExpanded: boolean
	onToggle: () => void
	onUpdate: (group: ShowGroup) => void
	onDelete: () => void
	fieldGroups: Array<{ value: string; items: Array<{ value: string; label: string }> }>
	isLoadingFields: boolean
	onEditItem: (item: { colIndex: number; itemIndex: number; item: ShowItem }) => void
}

function SortableGroupRow({
	group,
	index,
	isExpanded,
	onToggle,
	onUpdate,
	onDelete,
	fieldGroups,
	isLoadingFields,
	onEditItem
}: SortableGroupRowProps) {
	const id = `group:${index}`
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	}
	const label = group.label ?? group.name ?? 'Unnamed group'
	const hasLabel = !!(group.label ?? group.name)

	const deleteItem = (colIndex: number, itemIndex: number) => {
		const columnItems = getColumnItems(group).map((col, i) =>
			i === colIndex ? col.filter((_, j) => j !== itemIndex) : col
		)
		onUpdate({ ...group, columnItems })
	}

	const columnItems = getColumnItems(group)
	const fieldLabels = new Map(fieldGroups.flatMap(g => g.items).map(f => [f.value, f.label]))

	return (
		<Card ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
			<CardHeader
				className='cursor-pointer hover:bg-muted/50 transition-colors p-3'
				onClick={onToggle}
			>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						className='touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground flex-shrink-0'
						{...attributes}
						{...listeners}
						aria-label='Drag to reorder'
						onClick={e => e.stopPropagation()}
					>
						<GripVertical className='h-4 w-4' />
					</button>

					<Button
						variant='ghost'
						size='sm'
						className='p-0 h-auto'
						onClick={e => {
							e.stopPropagation()
							onToggle()
						}}
					>
						<ChevronRight
							className={`h-4 w-4 transition-transform ${
								isExpanded ? 'rotate-90' : ''
							}`}
						/>
					</Button>

					<div className='flex-1 min-w-0'>
						<span
							className={`text-sm font-medium truncate block ${
								!hasLabel ? 'text-muted-foreground' : ''
							}`}
						>
							{label}
						</span>
					</div>

					<Button
						variant='ghost'
						size='sm'
						className='h-7 w-7 p-0 flex-shrink-0 text-destructive hover:text-destructive'
						onClick={e => {
							e.stopPropagation()
							onDelete()
						}}
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent className='space-y-4'>
					{/* Group Configuration */}
					<div className='space-y-2'>
						<Label>Group name</Label>
						<InputGroup>
							<InputGroupInput
								value={group.label ?? ''}
								onChange={e => onUpdate({ ...group, label: e.target.value })}
								placeholder='Group name'
								onClick={e => e.stopPropagation()}
							/>
						</InputGroup>
					</div>

					<div className='space-y-2'>
						<Label>Description</Label>
						<InputGroup>
							<InputGroupTextarea
								value={group.description ?? ''}
								onChange={e => onUpdate({ ...group, description: e.target.value })}
								placeholder='Optional description'
								className='resize-none'
								rows={2}
								onClick={e => e.stopPropagation()}
							/>
						</InputGroup>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<Field orientation='horizontal'>
							<FieldContent>
								<FieldLabel htmlFor={`showLabel-${index}`}>Show label</FieldLabel>
								<FieldDescription>
									Display the group name as a heading above the fields.
								</FieldDescription>
							</FieldContent>
							<Switch
								id={`showLabel-${index}`}
								checked={group.showLabel ?? true}
								onCheckedChange={checked =>
									onUpdate({ ...group, showLabel: checked === true })
								}
							/>
						</Field>

						{/* Columns Slider */}
						<Field>
							<FieldContent>
								<FieldLabel htmlFor={`columns-slider-${index}`}>
									Number of columns
								</FieldLabel>
								<FieldDescription>
									Organize fields into multiple columns (1-8)
								</FieldDescription>
							</FieldContent>
							<div className='space-y-3'>
								<div className='flex items-center gap-4'>
									<Slider
										id={`columns-slider-${index}`}
										min={1}
										max={8}
										step={1}
										value={[columnItems.length]}
										onValueChange={([val]: number[]) => {
											const currentItems = getColumnItems(group)
											const newColumnItems = Array.from(
												{ length: val },
												(_, i) =>
													currentItems[i] ? [...currentItems[i]] : []
											)
											onUpdate({
												...group,
												columns: val,
												columnItems: newColumnItems
											})
										}}
										className='flex-1'
									/>
									<InputGroup className='w-20'>
										<InputGroupAddon align='inline-start'>
											<Columns className='h-3.5 w-3.5' />
										</InputGroupAddon>
										<InputGroupInput
											type='number'
											min={1}
											max={8}
											value={columnItems.length}
											onChange={e => {
												const val = Math.min(
													8,
													Math.max(1, parseInt(e.target.value, 10) || 1)
												)
												const currentItems = getColumnItems(group)
												const newColumnItems = Array.from(
													{ length: val },
													(_, i) =>
														currentItems[i] ? [...currentItems[i]] : []
												)
												onUpdate({
													...group,
													columns: val,
													columnItems: newColumnItems
												})
											}}
											className='text-center'
										/>
									</InputGroup>
								</div>
							</div>
						</Field>
					</div>

					<Separator />

					{/* Columns Configuration */}
					<div className='space-y-3'>
						<Label>Fields layout</Label>
						<div className='space-y-2'>
							{/* Grid Preview */}
							<div
								className='grid gap-2 p-4 border rounded-lg bg-muted/20'
								style={{
									gridTemplateColumns: `repeat(${columnItems.length}, minmax(0, 1fr))`
								}}
							>
								{/* Render all items in a single grid with proper colspan */}
								{columnItems.flatMap((items, colIndex) =>
									items.map((item, itemIndex) => {
										const colspan = Math.min(
											item.colspan || 1,
											columnItems.length
										)
										return (
											<div
												key={`${colIndex}-${itemIndex}`}
												style={{
													gridColumn: `span ${colspan}`
												}}
											>
												<ItemCard
													item={item}
													fieldLabel={
														fieldLabels.get(item.field) ?? item.field
													}
													onEdit={() =>
														onEditItem({
															colIndex,
															itemIndex,
															item: { ...item }
														})
													}
													onDelete={() => deleteItem(colIndex, itemIndex)}
												/>
											</div>
										)
									})
								)}
								{/* Add field buttons for each column */}
								{columnItems.map((items, colIndex) => (
									<div key={`add-${colIndex}`}>
										<Button
											type='button'
											variant='outline'
											size='sm'
											className='w-full h-auto min-h-[60px] border-dashed'
											onClick={() => {
												onEditItem({
													colIndex,
													itemIndex: -1,
													item: { field: '', type: 'text' }
												})
											}}
										>
											<Plus className='h-4 w-4 mr-1' />
											Add field
										</Button>
									</div>
								))}
							</div>
							{/* Empty state */}
							{columnItems.every(col => col.length === 0) && (
								<div className='rounded-md border border-dashed p-6 text-sm text-center'>
									{isLoadingFields ? (
										<p className='text-muted-foreground'>Loading fields...</p>
									) : fieldGroups.length === 0 ? (
										<div className='space-y-1'>
											<p className='font-medium text-foreground'>
												No fields available
											</p>
											<p className='text-xs text-muted-foreground'>
												Make sure your API endpoint is configured and
												returns data.
											</p>
										</div>
									) : (
										<p className='text-muted-foreground'>
											No fields yet. Add fields using the buttons above.
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	)
}

// ---- Item Card (No Drag and Drop) ----
interface ItemCardProps {
	item: ShowItem
	fieldLabel: string
	onEdit: () => void
	onDelete: () => void
}

function ItemCard({ item, fieldLabel, onEdit, onDelete }: ItemCardProps) {
	// Use item.label if available, otherwise use fieldLabel from field groups, otherwise use field name
	const displayLabel = item.label || fieldLabel || item.field

	return (
		<Card className='p-3 hover:bg-muted/50 transition-colors cursor-pointer' onClick={onEdit}>
			<div className='flex items-center gap-2'>
				<div className='flex-1 min-w-0'>
					<span className='text-sm font-medium truncate block'>{displayLabel}</span>
				</div>
				<Button
					variant='ghost'
					size='sm'
					className='h-7 w-7 p-0 flex-shrink-0'
					onClick={e => {
						e.stopPropagation()
						onDelete()
					}}
				>
					<Trash2 className='h-3.5 w-3.5 text-destructive' />
				</Button>
			</div>
		</Card>
	)
}

// ---- Helpers ----
function getColumnItems(group: ShowGroup): ShowItem[][] {
	if (group.columnItems && group.columnItems.length > 0) return group.columnItems
	const cols = group.columns ?? 1
	return Array.from({ length: cols }, () => [])
}
