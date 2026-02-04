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
import { Slider } from '@/components/ui/slider'
import { Field, FieldContent, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Columns } from 'lucide-react'
import type { ShowGroup } from '../../../types'

interface GroupEditorProps {
	group: ShowGroup
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (group: ShowGroup) => void
}

export function GroupEditor({ group, open, onOpenChange, onSave }: GroupEditorProps) {
	const [label, setLabel] = useState(group.label ?? group.name ?? '')
	const [description, setDescription] = useState(group.description ?? '')
	const [columns, setColumns] = useState(String(group.columns ?? 1))

	const handleSave = () => {
		const cols = Math.min(8, Math.max(1, parseInt(columns, 10) || 1))
		const columnItems = normalizeColumnItems(group, cols)
		onSave({
			...group,
			label: label || undefined,
			name: label || undefined,
			description: description || undefined,
			columns: cols,
			columnItems
		})
	}

	const columnsNum = Math.min(8, Math.max(1, parseInt(columns, 10) || 1))

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle>Edit group</DialogTitle>
					<DialogDescription>
						Configure group heading, description, and column layout.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-6 py-4'>
					{/* Group Label */}
					<div className='grid gap-2'>
						<Label htmlFor='group-label'>Group label</Label>
						<InputGroup>
							<InputGroupInput
								id='group-label'
								value={label}
								onChange={e => setLabel(e.target.value)}
								placeholder='e.g. Basic info'
							/>
						</InputGroup>
					</div>

					{/* Description */}
					<div className='grid gap-2'>
						<Label htmlFor='group-description'>Description (optional)</Label>
						<InputGroup>
							<InputGroupInput
								id='group-description'
								value={description}
								onChange={e => setDescription(e.target.value)}
								placeholder='Short description'
							/>
						</InputGroup>
					</div>

					{/* Columns Slider */}
					<Field>
						<FieldContent>
							<FieldLabel htmlFor='columns-slider'>Number of columns</FieldLabel>
							<FieldDescription>
								Organize fields into multiple columns (1-8)
							</FieldDescription>
						</FieldContent>
						<div className='space-y-3'>
							<div className='flex items-center gap-4'>
								<Slider
									id='columns-slider'
									min={1}
									max={8}
									step={1}
									value={[columnsNum]}
									onValueChange={([val]) => setColumns(String(val))}
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
										value={columns}
										onChange={e => setColumns(e.target.value)}
										className='text-center'
									/>
								</InputGroup>
							</div>
						</div>
					</Field>
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

function normalizeColumnItems(group: ShowGroup, targetColumns: number) {
	const current = group.columnItems ?? []
	const result = []
	for (let i = 0; i < targetColumns; i++) {
		result.push(current[i] ? [...current[i]] : [])
	}
	return result
}
