'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { ColumnConfig, ListConfig } from '@/lib/types/list-config'
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
import { AListColumnsEditor } from './a-list-columns-editor'
import { useUpdateListConfig } from '@/lib/hooks/use-list-config'

interface AListColumnsProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	children: ReactNode
}

export function AListColumns({ resourceId, currentConfig, editMode, children }: AListColumnsProps) {
	const [dialogOpen, setDialogOpen] = useState(false)
	const updateMutation = useUpdateListConfig(resourceId)

	// Initialize columns from current config
	const initialColumns = useMemo(() => currentConfig?.columns || [], [currentConfig?.columns])
	const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns)

	// Reset columns when dialog opens
	const handleDialogChange = (open: boolean) => {
		if (open) {
			setColumns(initialColumns)
		}
		setDialogOpen(open)
	}

	const handleSave = async () => {
		try {
			await updateMutation.mutateAsync({
				columns
			})
			setDialogOpen(false)
		} catch (error) {
			console.error('Error saving columns:', error)
		}
	}

	return (
		<>
			{editMode ? (
				<div
					className='cursor-pointer transition-all border-2 border-dashed border-muted-foreground/30 rounded-md p-4 hover:border-muted-foreground/60 hover:bg-muted/30'
					onClick={() => setDialogOpen(true)}
				>
					{children}
				</div>
			) : (
				<>{children}</>
			)}

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
						<AListColumnsEditor columns={columns} onChange={setColumns} />
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
