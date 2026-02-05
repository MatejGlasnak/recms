'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { FormModal } from '../../../components/index.ts'
import type { ColumnConfig } from '@blume/recms-core'
import type { BlockFieldConfig } from '@blume/recms-core'
import { columnTextConfig } from '../../../columns/column-text/config'
import { columnNumberConfig } from '../../../columns/column-number/config'
import { columnDateConfig } from '../../../columns/column-date/config'
import { columnBooleanConfig } from '../../../columns/column-boolean/config'
import { columnBadgeConfig } from '../../../columns/column-badge/config'
import { columnJsonConfig } from '../../../columns/column-json/config'

export interface ColumnEditorProps {
	value: unknown
	onChange: (value: unknown) => void
	field?: {
		label?: string
		comment?: string
		required?: boolean
	}
}

// Map column types to their field configs
const columnConfigMap: Record<ColumnConfig['type'], BlockFieldConfig> = {
	text: columnTextConfig,
	number: columnNumberConfig,
	date: columnDateConfig,
	boolean: columnBooleanConfig,
	badge: columnBadgeConfig,
	json: columnJsonConfig
}

// Base config for type selection
const typeSelectionConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'type',
			type: 'dropdown',
			label: 'Column Type',
			required: true,
			options: [
				{ label: 'Text', value: 'text' },
				{ label: 'Number', value: 'number' },
				{ label: 'Date', value: 'date' },
				{ label: 'Boolean', value: 'boolean' },
				{ label: 'Badge', value: 'badge' },
				{ label: 'JSON', value: 'json' }
			],
			default: 'text',
			comment: 'Determines how the value is formatted and displayed',
			span: 'full'
		}
	]
}

export function ColumnEditor({ value, onChange, field }: ColumnEditorProps) {
	const columns = useMemo(() => (value as ColumnConfig[]) || [], [value])
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingColumn, setEditingColumn] = useState<ColumnConfig | null>(null)
	const [isNewColumn, setIsNewColumn] = useState(false)

	const handleAdd = useCallback(() => {
		setEditingColumn({
			id: crypto.randomUUID(),
			field: '',
			label: '',
			type: 'text',
			enabledByDefault: true,
			sortable: true
		})
		setIsNewColumn(true)
		setDialogOpen(true)
	}, [])

	const handleEdit = useCallback((column: ColumnConfig) => {
		setEditingColumn({ ...column })
		setIsNewColumn(false)
		setDialogOpen(true)
	}, [])

	const handleDelete = useCallback(
		(id: string) => {
			onChange(columns.filter(c => c.id !== id))
		},
		[columns, onChange]
	)

	const handleSubmit = useCallback(
		(values: Record<string, unknown>) => {
			if (!editingColumn) return

			const updatedColumn = {
				...editingColumn,
				...values
			} as ColumnConfig

			const existingIndex = columns.findIndex(c => c.id === editingColumn.id)
			if (existingIndex >= 0) {
				const updated = [...columns]
				updated[existingIndex] = updatedColumn
				onChange(updated)
			} else {
				onChange([...columns, updatedColumn])
			}

			setDialogOpen(false)
			setEditingColumn(null)
		},
		[editingColumn, columns, onChange]
	)

	// Build the dynamic field config based on the selected type
	const fieldConfig = useMemo((): BlockFieldConfig => {
		if (!editingColumn) {
			return { fields: [] }
		}

		const typeConfig = columnConfigMap[editingColumn.type]
		return {
			fields: [...typeSelectionConfig.fields, ...typeConfig.fields]
		}
	}, [editingColumn])

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				{field?.label && (
					<Label className='text-sm font-semibold'>
						{field.label}
						{field.required && <span className='text-destructive ml-1'>*</span>}
					</Label>
				)}
				<Button onClick={handleAdd} size='sm'>
					<Plus className='h-4 w-4 mr-2' />
					Add Column
				</Button>
			</div>

			<div className='flex flex-col gap-2'>
				{columns.map(column => (
					<Card
						key={column.id}
						className='p-3 hover:bg-muted/50 transition-colors cursor-pointer'
						onClick={() => handleEdit(column)}
					>
						<div className='flex items-center gap-3'>
							<GripVertical className='h-4 w-4 text-muted-foreground cursor-move flex-shrink-0' />
							<div className='flex-1 flex items-center gap-2'>
								<span className='font-medium'>{column.label}</span>
								<span className='text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground'>
									{column.type}
								</span>
								{column.field && (
									<span className='text-xs text-muted-foreground'>
										({column.field})
									</span>
								)}
							</div>
							<Button
								variant='ghost'
								size='sm'
								onClick={e => {
									e.stopPropagation()
									handleDelete(column.id)
								}}
								className='h-8 w-8 p-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10'
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					</Card>
				))}
			</div>

			{field?.comment && <p className='text-sm text-muted-foreground'>{field.comment}</p>}

			<FormModal
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				title={isNewColumn ? 'Add Column' : 'Edit Column'}
				description='Configure column settings including field mapping, display type, and visibility options.'
				fieldConfig={fieldConfig}
				initialValues={(editingColumn as unknown as Record<string, unknown>) || {}}
				onSubmit={handleSubmit}
				onDelete={
					!isNewColumn && editingColumn ? () => handleDelete(editingColumn.id) : undefined
				}
				submitLabel='Save'
				cancelLabel='Cancel'
				deleteLabel='Delete Column'
			/>
		</div>
	)
}
