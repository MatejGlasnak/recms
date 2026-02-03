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
import { Loader2 } from 'lucide-react'
import { useUpdateListConfig } from '../../../hooks'
import type { ColumnConfig, ListConfig } from '../../../types'
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
	const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns)

	const handleDialogChange = (open: boolean) => {
		if (open) {
			setColumns(initialColumns)
		}
		setDialogOpen(open)
	}

	const handleSave = async () => {
		try {
			await updateMutation.mutateAsync({ columns })
			setDialogOpen(false)
		} catch (error) {
			console.error('Error saving columns:', error)
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
						<DialogTitle>Column Configuration</DialogTitle>
						<DialogDescription>
							Define columns that will be displayed in the list. Configure their type,
							default visibility, and sorting behavior.
						</DialogDescription>
					</DialogHeader>
					<div className='py-4'>
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
