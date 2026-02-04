'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Plus, Trash2, GripVertical, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'
import { FormField } from '../../FormField'

export function RepeaterField({
	field,
	value,
	onChange,
	error,
	disabled,
	readOnly
}: FieldComponentProps) {
	const items = (Array.isArray(value) ? value : []) as Record<string, unknown>[]
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]))

	const toggleItem = (index: number) => {
		setExpandedItems(prev => {
			const next = new Set(prev)
			if (next.has(index)) {
				next.delete(index)
			} else {
				next.add(index)
			}
			return next
		})
	}

	const addItem = () => {
		const defaultItem: Record<string, unknown> = {}

		// Initialize with default values from field definitions
		if (field.form?.fields) {
			field.form.fields.forEach(subField => {
				if (subField.default !== undefined) {
					defaultItem[subField.name] = subField.default
				}
				// Auto-generate ID for items
				if (subField.name === 'id' && !defaultItem.id) {
					defaultItem.id = crypto.randomUUID()
				}
			})
		}

		const newItems = [...items, defaultItem]
		onChange(newItems)
		setExpandedItems(prev => new Set(prev).add(items.length))
	}

	const removeItem = (index: number) => {
		const newItems = items.filter((_, i) => i !== index)
		onChange(newItems)
		setExpandedItems(prev => {
			const next = new Set(prev)
			next.delete(index)
			return next
		})
	}

	const moveItem = (fromIndex: number, toIndex: number) => {
		const newItems = [...items]
		const [movedItem] = newItems.splice(fromIndex, 1)
		newItems.splice(toIndex, 0, movedItem)
		onChange(newItems)
	}

	const updateItem = (index: number, fieldName: string, fieldValue: unknown) => {
		const newItems = [...items]
		newItems[index] = {
			...newItems[index],
			[fieldName]: fieldValue
		}
		onChange(newItems)
	}

	const getItemLabel = (item: Record<string, unknown>, index: number): string => {
		// Try to find a meaningful label from the item
		const labelField = field.form?.fields?.find(f => f.name === 'label' || f.name === 'title')
		if (labelField && item[labelField.name]) {
			return String(item[labelField.name])
		}
		return `Item ${index + 1}`
	}

	if (!field.form?.fields) {
		return (
			<Field data-invalid>
				{field.label && (
					<FieldLabel>
						{field.label}
						{field.required && <span className='ml-1 text-destructive'>*</span>}
					</FieldLabel>
				)}
				<FieldError>Repeater field requires a form configuration</FieldError>
			</Field>
		)
	}

	return (
		<Field data-invalid={!!error}>
			{field.label && (
				<FieldLabel>
					{field.label}
					{field.required && <span className='ml-1 text-destructive'>*</span>}
				</FieldLabel>
			)}
			{field.commentAbove && <FieldDescription>{field.commentAbove}</FieldDescription>}

			<div className='space-y-4'>
				{items.length === 0 ? (
					<div className='py-8 text-center text-muted-foreground'>
						{field.placeholder ||
							`No ${
								field.label?.toLowerCase() || 'items'
							} yet. Click "Add" to get started.`}
					</div>
				) : (
					<div className='space-y-4'>
						{items.map((item, index) => (
							<Card key={index}>
								<CardHeader className='p-4'>
									<div className='flex items-center gap-2'>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											className='cursor-move'
											disabled={disabled || readOnly || items.length === 1}
										>
											<GripVertical className='size-4' />
										</Button>

										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => toggleItem(index)}
											disabled={disabled || readOnly}
										>
											<ChevronRight
												className={`size-4 transition-transform ${
													expandedItems.has(index) ? 'rotate-90' : ''
												}`}
											/>
										</Button>

										<div className='min-w-0 flex-1 text-sm font-medium'>
											{getItemLabel(item, index)}
										</div>

										<div className='flex gap-1'>
											{index > 0 && (
												<Button
													type='button'
													variant='ghost'
													size='sm'
													onClick={() => moveItem(index, index - 1)}
													disabled={disabled || readOnly}
												>
													<ChevronUp className='size-4' />
												</Button>
											)}
											{index < items.length - 1 && (
												<Button
													type='button'
													variant='ghost'
													size='sm'
													onClick={() => moveItem(index, index + 1)}
													disabled={disabled || readOnly}
												>
													<ChevronDown className='size-4' />
												</Button>
											)}
											<Button
												type='button'
												variant='ghost'
												size='sm'
												className='text-destructive hover:text-destructive'
												onClick={() => removeItem(index)}
												disabled={disabled || readOnly}
											>
												<Trash2 className='size-4' />
											</Button>
										</div>
									</div>
								</CardHeader>

								{expandedItems.has(index) && (
									<CardContent className='p-4 pt-0'>
										<div className='grid grid-cols-12 gap-4'>
											{field.form?.fields.map(subField => (
												<FormField
													key={subField.name}
													field={subField}
													value={item[subField.name]}
													onChange={fieldValue =>
														updateItem(index, subField.name, fieldValue)
													}
													disabled={disabled}
													readOnly={readOnly}
													allValues={item}
												/>
											))}
										</div>
									</CardContent>
								)}
							</Card>
						))}
					</div>
				)}

				<Button
					type='button'
					variant='outline'
					onClick={addItem}
					className='w-full'
					disabled={
						disabled ||
						readOnly ||
						(field.maxItems !== undefined && items.length >= field.maxItems)
					}
				>
					<Plus className='mr-2 size-4' />
					Add {field.label || 'Item'}
				</Button>
			</div>

			{field.comment && <FieldDescription>{field.comment}</FieldDescription>}
			{error && <FieldError>{error}</FieldError>}
		</Field>
	)
}
