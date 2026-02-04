'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { ColumnConfig } from '../../../types/block-config'

export interface ColumnEditorProps {
	value: ColumnConfig[]
	onChange: (columns: ColumnConfig[]) => void
}

export function ColumnEditor({ value, onChange }: ColumnEditorProps) {
	const columns = value || []
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingColumn, setEditingColumn] = useState<ColumnConfig | null>(null)

	const handleAdd = useCallback(() => {
		setEditingColumn({
			id: crypto.randomUUID(),
			field: '',
			label: '',
			type: 'text',
			enabledByDefault: true,
			sortable: true
		})
		setDialogOpen(true)
	}, [])

	const handleEdit = useCallback((column: ColumnConfig) => {
		setEditingColumn({ ...column })
		setDialogOpen(true)
	}, [])

	const handleDelete = useCallback(
		(id: string) => {
			onChange(columns.filter(c => c.id !== id))
		},
		[columns, onChange]
	)

	const handleSave = useCallback(() => {
		if (!editingColumn) return
		if (!editingColumn.field || !editingColumn.label) {
			alert('Field and label are required')
			return
		}
		const existingIndex = columns.findIndex(c => c.id === editingColumn.id)
		if (existingIndex >= 0) {
			const updated = [...columns]
			updated[existingIndex] = editingColumn
			onChange(updated)
		} else {
			onChange([...columns, editingColumn])
		}
		setDialogOpen(false)
		setEditingColumn(null)
	}, [editingColumn, columns, onChange])

	const handleCancel = useCallback(() => {
		setDialogOpen(false)
		setEditingColumn(null)
	}, [])

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-semibold'>Columns</h3>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button size='sm' onClick={handleAdd}>
							<Plus className='h-4 w-4 mr-2' />
							Add Column
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[600px]'>
						<DialogHeader>
							<DialogTitle>
								{editingColumn?.field &&
								columns.find(c => c.id === editingColumn.id)
									? 'Edit Column'
									: 'Add Column'}
							</DialogTitle>
							<DialogDescription>
								Configure column settings including field mapping, display type, and
								visibility options.
							</DialogDescription>
						</DialogHeader>

						{editingColumn && (
							<div className='grid gap-4 py-4'>
								<div className='grid gap-2'>
									<Label htmlFor='field'>Field Name</Label>
									<Input
										id='field'
										value={editingColumn.field}
										onChange={e =>
											setEditingColumn({
												...editingColumn,
												field: e.target.value
											})
										}
										placeholder='e.g., userId, createdAt'
									/>
									<p className='text-xs text-muted-foreground'>
										The exact field name from your data source
									</p>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='label'>Display Label</Label>
									<Input
										id='label'
										value={editingColumn.label}
										onChange={e =>
											setEditingColumn({
												...editingColumn,
												label: e.target.value
											})
										}
										placeholder='e.g., User ID, Created At'
									/>
									<p className='text-xs text-muted-foreground'>
										How the column header will be displayed
									</p>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='type'>Column Type</Label>
									<Select
										value={editingColumn.type}
										onValueChange={(value: ColumnConfig['type']) =>
											setEditingColumn({ ...editingColumn, type: value })
										}
									>
										<SelectTrigger id='type'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='text'>Text</SelectItem>
											<SelectItem value='number'>Number</SelectItem>
											<SelectItem value='date'>Date</SelectItem>
											<SelectItem value='boolean'>Boolean</SelectItem>
											<SelectItem value='badge'>Badge</SelectItem>
											<SelectItem value='json'>JSON</SelectItem>
										</SelectContent>
									</Select>
									<p className='text-xs text-muted-foreground'>
										Determines how the value is formatted and displayed
									</p>
								</div>

								{editingColumn.type === 'badge' && (
									<div className='grid gap-2'>
										<Label htmlFor='badgeVariant'>Badge Style</Label>
										<Select
											value={editingColumn.badgeVariant || 'default'}
											onValueChange={(
												value:
													| 'default'
													| 'secondary'
													| 'destructive'
													| 'outline'
											) =>
												setEditingColumn({
													...editingColumn,
													badgeVariant: value
												})
											}
										>
											<SelectTrigger id='badgeVariant'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='default'>
													Default (Primary)
												</SelectItem>
												<SelectItem value='secondary'>Secondary</SelectItem>
												<SelectItem value='destructive'>
													Destructive (Red)
												</SelectItem>
												<SelectItem value='outline'>Outline</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}

								<div className='flex items-center justify-between rounded-lg border p-4'>
									<div className='space-y-0.5'>
										<Label htmlFor='enabled'>Enabled by Default</Label>
										<p className='text-xs text-muted-foreground'>
											Show this column when the page loads
										</p>
									</div>
									<Switch
										id='enabled'
										checked={editingColumn.enabledByDefault}
										onCheckedChange={checked =>
											setEditingColumn({
												...editingColumn,
												enabledByDefault: checked
											})
										}
									/>
								</div>

								<div className='flex items-center justify-between rounded-lg border p-4'>
									<div className='space-y-0.5'>
										<Label htmlFor='sortable'>Sortable</Label>
										<p className='text-xs text-muted-foreground'>
											Allow users to sort by this column
										</p>
									</div>
									<Switch
										id='sortable'
										checked={editingColumn.sortable}
										onCheckedChange={checked =>
											setEditingColumn({
												...editingColumn,
												sortable: checked
											})
										}
									/>
								</div>

								<div className='grid gap-2'>
									<Label htmlFor='width'>Column Width (optional)</Label>
									<Input
										id='width'
										type='number'
										value={editingColumn.width || ''}
										onChange={e =>
											setEditingColumn({
												...editingColumn,
												width: e.target.value
													? Number(e.target.value)
													: undefined
											})
										}
										placeholder='e.g., 200'
									/>
									<p className='text-xs text-muted-foreground'>
										Width in pixels (optional)
									</p>
								</div>
							</div>
						)}

						<DialogFooter>
							<Button variant='outline' onClick={handleCancel}>
								Cancel
							</Button>
							<Button onClick={handleSave}>Save Column</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className='space-y-2'>
				{columns.length === 0 ? (
					<Card className='p-8 text-center text-muted-foreground'>
						<p>No columns configured yet.</p>
						<p className='text-sm mt-2'>Click &quot;Add Column&quot; to get started.</p>
					</Card>
				) : (
					columns.map(column => (
						<Card key={column.id} className='p-3 hover:bg-muted/50 transition-colors'>
							<div className='flex items-center gap-3'>
								<GripVertical className='h-4 w-4 text-muted-foreground cursor-move flex-shrink-0' />
								<div
									className='flex-1 flex items-center gap-2 cursor-pointer'
									onClick={() => handleEdit(column)}
								>
									<span className='font-medium'>{column.label}</span>
									<span className='text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground'>
										{column.type}
									</span>
								</div>
								<Button
									variant='ghost'
									size='sm'
									onClick={e => {
										e.stopPropagation()
										handleDelete(column.id)
									}}
									className='h-8 w-8 p-0 flex-shrink-0'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</Card>
					))
				)}
			</div>
		</div>
	)
}
