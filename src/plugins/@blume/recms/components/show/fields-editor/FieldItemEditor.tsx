'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Field, FieldContent, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Hash, Type as TypeIcon, Columns } from 'lucide-react'
import type { ShowItem } from '../../../types'

interface FieldItemEditorProps {
	item: ShowItem
	fieldGroups: Array<{ value: string; items: Array<{ value: string; label: string }> }>
	maxColumns: number
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (item: ShowItem) => void
}

export function FieldItemEditor({
	item,
	fieldGroups,
	maxColumns,
	open,
	onOpenChange,
	onSave
}: FieldItemEditorProps) {
	const [field, setField] = useState(item.field)
	const [type, setType] = useState<ShowItem['type']>(item.type)
	const [label, setLabel] = useState(item.label ?? '')
	const [colspan, setColspan] = useState(String(item.colspan ?? 1))

	const handleSave = () => {
		const colspanNum = Math.max(1, parseInt(colspan, 10) || 1)
		onSave({
			field,
			type,
			label: label.trim() || undefined,
			colspan: colspanNum > 1 ? colspanNum : undefined
		})
	}

	const colspanNum = Math.max(1, Math.min(maxColumns, parseInt(colspan, 10) || 1))

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>Edit field</DialogTitle>
					<DialogDescription>
						Configure field display type, label, and layout options.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-6 py-4'>
					{/* Field Selection */}
					<div className='grid gap-2'>
						<Label htmlFor='field-select'>Field</Label>
						<InputGroup>
							<InputGroupAddon align='inline-start'>
								<Hash className='h-4 w-4' />
							</InputGroupAddon>
							<Select value={field} onValueChange={v => setField(v ?? '')}>
								<SelectTrigger
									id='field-select'
									className='border-0 shadow-none focus:ring-0'
								>
									<SelectValue placeholder='Select field' />
								</SelectTrigger>
								<SelectContent>
									{fieldGroups.map(group => (
										<div key={group.value}>
											<div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground'>
												{group.value}
											</div>
											{group.items.map(item => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</div>
									))}
								</SelectContent>
							</Select>
						</InputGroup>
					</div>

					{/* Type Selection */}
					<div className='grid gap-2'>
						<Label htmlFor='type-select'>Display type</Label>
						<InputGroup>
							<InputGroupAddon align='inline-start'>
								<TypeIcon className='h-4 w-4' />
							</InputGroupAddon>
							<Select
								value={type}
								onValueChange={v => setType(v as ShowItem['type'])}
							>
								<SelectTrigger
									id='type-select'
									className='border-0 shadow-none focus:ring-0'
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='text'>Text</SelectItem>
									<SelectItem value='number'>Number</SelectItem>
									<SelectItem value='date'>Date</SelectItem>
									<SelectItem value='richtext'>Rich Text</SelectItem>
								</SelectContent>
							</Select>
						</InputGroup>
					</div>

					{/* Label Override */}
					<div className='grid gap-2'>
						<Label htmlFor='label-input'>Custom label (optional)</Label>
						<InputGroup>
							<InputGroupInput
								id='label-input'
								value={label}
								onChange={e => setLabel(e.target.value)}
								placeholder='Leave empty to use field name'
							/>
						</InputGroup>
					</div>

					{/* Colspan Slider */}
					{maxColumns > 1 && (
						<Field>
							<FieldContent>
								<FieldLabel htmlFor='colspan-slider'>Column span</FieldLabel>
								<FieldDescription>
									How many columns this field should span (1-{maxColumns})
								</FieldDescription>
							</FieldContent>
							<div className='space-y-3'>
								<div className='flex items-center gap-4'>
									<Slider
										id='colspan-slider'
										min={1}
										max={maxColumns}
										step={1}
										value={[colspanNum]}
										onValueChange={([val]) => setColspan(String(val))}
										className='flex-1'
									/>
									<InputGroup className='w-20'>
										<InputGroupAddon align='inline-start'>
											<Columns className='h-3.5 w-3.5' />
										</InputGroupAddon>
										<InputGroupInput
											type='number'
											min={1}
											max={maxColumns}
											value={colspan}
											onChange={e => setColspan(e.target.value)}
											className='text-center'
										/>
									</InputGroup>
								</div>
							</div>
						</Field>
					)}
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
