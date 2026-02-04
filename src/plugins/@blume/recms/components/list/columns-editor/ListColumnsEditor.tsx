'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useUpdateListConfig } from '../../../hooks'
import type { ColumnConfig, ListConfig, RowClickAction } from '../../../types'
import { EditableWrapper } from '../../ui/EditableWrapper'
import { ListColumnsEditorForm } from './ListColumnsEditorForm'

export interface ListColumnsEditorProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	children: ReactNode
}

export function ListColumnsEditor({
	resourceId,
	currentConfig,
	editMode,
	children
}: ListColumnsEditorProps) {
	const [dialogOpen, setDialogOpen] = useState(false)
	const updateMutation = useUpdateListConfig(resourceId)
	const initialColumns = useMemo(() => currentConfig?.columns || [], [currentConfig?.columns])
	const initialRowClickAction = useMemo(
		() => currentConfig?.rowClickAction ?? 'none',
		[currentConfig?.rowClickAction]
	)
	const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns)
	const [rowClickAction, setRowClickAction] = useState<RowClickAction>(initialRowClickAction)

	const handleDialogChange = (open: boolean) => {
		if (open) {
			setColumns(initialColumns)
			setRowClickAction(initialRowClickAction)
		}
		setDialogOpen(open)
	}

	const handleSave = async () => {
		try {
			await updateMutation.mutateAsync({ columns, rowClickAction })
			setDialogOpen(false)
		} catch (error) {
			console.error('Error saving table configuration:', error)
		}
	}

	return (
		<>
			<EditableWrapper
				editMode={editMode}
				onEditClick={() => setDialogOpen(true)}
				className='p-4'
			>
				{children}
			</EditableWrapper>

			<Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
				<DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Table Configuration</DialogTitle>
						<DialogDescription>
							Configure row click behavior and columns for the list table.
						</DialogDescription>
					</DialogHeader>
					<div className='py-4 space-y-6'>
						<div className='space-y-2'>
							<Label>Row click</Label>
							<Select
								value={rowClickAction}
								onValueChange={value => setRowClickAction(value as RowClickAction)}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='What happens when clicking a row' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='none'>Nothing</SelectItem>
									<SelectItem value='show'>Show</SelectItem>
									<SelectItem value='edit'>Edit</SelectItem>
								</SelectContent>
							</Select>
							<p className='text-sm text-muted-foreground'>
								Choose what happens when a user clicks a row in the table.
							</p>
						</div>
						<ListColumnsEditorForm columns={columns} onChange={setColumns} />
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => setDialogOpen(false)}
							disabled={updateMutation.isPending}
						>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={updateMutation.isPending}>
							{updateMutation.isPending && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
