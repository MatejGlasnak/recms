'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Combobox,
	ComboboxInput,
	ComboboxContent,
	ComboboxList,
	ComboboxItem,
	ComboboxEmpty
} from '@/components/ui/combobox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Columns } from 'lucide-react'
import type { ShowFieldConfig } from './types'

// Common field names that are typically available in records
const COMMON_FIELDS = [
	{ value: 'id', label: 'ID' },
	{ value: 'title', label: 'Title' },
	{ value: 'slug', label: 'Slug' },
	{ value: 'description', label: 'Description' },
	{ value: 'content', label: 'Content' },
	{ value: 'createdAt', label: 'Created At' },
	{ value: 'updatedAt', label: 'Updated At' },
	{ value: 'publishedAt', label: 'Published At' },
	{ value: 'deletedAt', label: 'Deleted At' },
	{ value: 'isPublished', label: 'Is Published' },
	{ value: 'metaTitle', label: 'Meta Title' },
	{ value: 'metaDescription', label: 'Meta Description' },
	{ value: 'metaKeywords', label: 'Meta Keywords' },
	{ value: 'ogTitle', label: 'OG Title' },
	{ value: 'ogDescription', label: 'OG Description' }
]

interface FieldEditorProps {
	value: ShowFieldConfig[]
	onChange: (value: ShowFieldConfig[]) => void
	field: { name: string; label?: string }
}

export function FieldEditor({ value = [], onChange }: FieldEditorProps) {
	const [editingField, setEditingField] = useState<ShowFieldConfig | null>(null)
	const [editingIndex, setEditingIndex] = useState<number>(-1)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const handleAddField = () => {
		setEditingField({
			id: `field-${Date.now()}`,
			field: '',
			label: '',
			type: 'text',
			colspan: 1
		})
		setEditingIndex(-1)
		setIsDialogOpen(true)
	}

	const handleEditField = (index: number) => {
		setEditingField({ ...value[index] })
		setEditingIndex(index)
		setIsDialogOpen(true)
	}

	const handleSaveField = () => {
		if (!editingField || !editingField.field) return

		const newFields = [...value]
		if (editingIndex >= 0) {
			newFields[editingIndex] = editingField
		} else {
			newFields.push(editingField)
		}

		onChange(newFields)
		setIsDialogOpen(false)
		setEditingField(null)
		setEditingIndex(-1)
	}

	const handleDeleteField = (index: number) => {
		const newFields = value.filter((_, i) => i !== index)
		onChange(newFields)
	}

	const handleMoveField = (index: number, direction: 'up' | 'down') => {
		const newFields = [...value]
		const targetIndex = direction === 'up' ? index - 1 : index + 1

		if (targetIndex < 0 || targetIndex >= newFields.length) return
		;[newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
		onChange(newFields)
	}

	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				{value.map((field, index) => (
					<Card key={field.id}>
						<CardContent className='p-4'>
							<div className='flex items-center gap-3'>
								<div className='flex flex-col gap-1'>
									<Button
										variant='ghost'
										size='icon'
										className='h-6 w-6'
										onClick={() => handleMoveField(index, 'up')}
										disabled={index === 0}
									>
										<GripVertical className='h-4 w-4' />
									</Button>
								</div>

								<div className='flex-1 grid grid-cols-4 gap-2 items-center'>
									<div>
										<p className='text-sm font-medium'>
											{field.label || field.field}
										</p>
										<p className='text-xs text-muted-foreground'>
											{field.field}
										</p>
									</div>
									<div className='text-sm text-muted-foreground'>
										Type: {field.type}
									</div>
									<div className='text-sm text-muted-foreground'>
										Colspan: {field.colspan || 1}
									</div>
									<div className='flex gap-1 justify-end'>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8'
											onClick={() => handleEditField(index)}
										>
											<Pencil className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 text-destructive'
											onClick={() => handleDeleteField(index)}
										>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Button onClick={handleAddField} variant='outline' className='w-full'>
				<Plus className='h-4 w-4 mr-2' />
				Add Field
			</Button>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>{editingIndex >= 0 ? 'Edit Field' : 'Add Field'}</DialogTitle>
						<DialogDescription>Configure the field settings</DialogDescription>
					</DialogHeader>

					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='field-name'>Field Name*</Label>
							<Combobox
								value={editingField?.field || ''}
								onValueChange={value =>
									setEditingField(prev => ({ ...prev!, field: value || '' }))
								}
							>
								<ComboboxInput
									id='field-name'
									placeholder='Search or type field name...'
									showTrigger
									showClear
								/>
								<ComboboxContent>
									<ComboboxList>
										<ComboboxEmpty>
											No matching fields. Type to add custom field.
										</ComboboxEmpty>
										{COMMON_FIELDS.map(field => (
											<ComboboxItem key={field.value} value={field.value}>
												{field.label}
											</ComboboxItem>
										))}
									</ComboboxList>
								</ComboboxContent>
							</Combobox>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='field-label'>Display Label</Label>
							<Combobox
								value={editingField?.label || ''}
								onValueChange={value =>
									setEditingField(prev => ({ ...prev!, label: value || '' }))
								}
							>
								<ComboboxInput
									id='field-label'
									placeholder='Leave empty to use field name'
									showClear
								/>
								<ComboboxContent>
									<ComboboxList>
										<ComboboxEmpty>Type to add custom label.</ComboboxEmpty>
									</ComboboxList>
								</ComboboxContent>
							</Combobox>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='field-type'>Field Type</Label>
							<Select
								value={editingField?.type || 'text'}
								onValueChange={value =>
									setEditingField(prev => ({
										...prev!,
										type: value as ShowFieldConfig['type']
									}))
								}
							>
								<SelectTrigger id='field-type'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='text'>Text</SelectItem>
									<SelectItem value='number'>Number</SelectItem>
									<SelectItem value='date'>Date</SelectItem>
									<SelectItem value='richtext'>Rich Text</SelectItem>
									<SelectItem value='boolean'>Boolean</SelectItem>
									<SelectItem value='badge'>Badge</SelectItem>
									<SelectItem value='json'>JSON</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='field-colspan'>Column Span</Label>
							<div className='flex items-center gap-4'>
								<Slider
									id='field-colspan'
									min={1}
									max={12}
									step={1}
									value={[editingField?.colspan || 1]}
									onValueChange={values =>
										setEditingField(prev => ({
											...prev!,
											colspan: values[0]
										}))
									}
									className='flex-1'
								/>
								<InputGroup className='w-20'>
									<InputGroupAddon align='inline-start'>
										<Columns className='size-3.5' />
									</InputGroupAddon>
									<InputGroupInput
										type='number'
										min={1}
										max={12}
										value={editingField?.colspan || 1}
										onChange={e => {
											const val = Math.min(
												12,
												Math.max(1, parseInt(e.target.value, 10) || 1)
											)
											setEditingField(prev => ({
												...prev!,
												colspan: val
											}))
										}}
										className='text-center'
									/>
								</InputGroup>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant='outline' onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveField} disabled={!editingField?.field}>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
