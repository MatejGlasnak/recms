'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { usePageSetup } from '@/lib/contexts/page-context'
import { useResources, useDeleteResource } from '@/lib/hooks/use-resources'
import { ResourceDialog } from '@/components/resource-dialog'
import type { Resource } from '@/lib/types/resources'

export default function ResourcesPage() {
	usePageSetup('Resources', [
		{ label: 'Settings', href: '/admin/settings' },
		{ label: 'Configuration', href: '/admin/settings/configuration' },
		{ label: 'Resources' }
	])

	const { data: resources = [], isLoading } = useResources()
	const deleteMutation = useDeleteResource()
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingResource, setEditingResource] = useState<Resource | undefined>(undefined)

	const handleAddClick = () => {
		setEditingResource(undefined)
		setDialogOpen(true)
	}

	const handleEditClick = (resource: Resource) => {
		setEditingResource(resource)
		setDialogOpen(true)
	}

	const handleDeleteClick = (id: string) => {
		setResourceToDelete(id)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!resourceToDelete) return

		deleteMutation.mutate(resourceToDelete, {
			onSuccess: () => {
				setResourceToDelete(null)
				setDeleteDialogOpen(false)
			}
		})
	}

	const handleDeleteCancel = () => {
		setResourceToDelete(null)
		setDeleteDialogOpen(false)
	}

	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex flex-col gap-4 p-4 md:p-6'>
				<div className='flex items-start justify-between gap-4'>
					<div className='flex flex-col gap-1'>
						<h1 className='text-2xl font-semibold tracking-tight'>Resources</h1>
						<p className='text-sm text-muted-foreground'>
							Configure external REST API resources for the admin panel
						</p>
					</div>
					<Button size='sm' onClick={handleAddClick}>
						<Plus className='h-4 w-4 mr-2' />
						Add Resource
					</Button>
				</div>

				<div className='grid gap-3'>
					{isLoading ? (
						<Card>
							<CardContent className='flex items-center justify-center py-10'>
								<Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
							</CardContent>
						</Card>
					) : resources.length === 0 ? (
						<Card>
							<CardContent className='flex flex-col items-center justify-center py-10'>
								<p className='text-sm text-muted-foreground mb-4'>
									No resources configured yet
								</p>
								<Button size='sm' onClick={handleAddClick}>
									<Plus className='h-4 w-4 mr-2' />
									Add Your First Resource
								</Button>
							</CardContent>
						</Card>
					) : (
						resources.map(resource => (
							<Card key={resource.id}>
								<CardHeader className='p-4'>
									<div className='flex items-start justify-between gap-4'>
										<div className='flex-1 min-w-0'>
											<CardTitle className='text-base font-medium'>
												{resource.label}
											</CardTitle>
											<CardDescription className='mt-1 space-y-1'>
												<div>
													<code className='text-xs bg-muted px-2 py-0.5 rounded'>
														{resource.name}
													</code>
												</div>
												<div>
													<code className='text-xs bg-muted px-2 py-0.5 rounded'>
														{resource.endpoint}
													</code>
												</div>
											</CardDescription>
										</div>
										<div className='flex gap-1 shrink-0'>
											<Button
												variant='outline'
												size='icon'
												className='h-8 w-8'
												onClick={() => handleEditClick(resource)}
											>
												<Pencil className='h-3.5 w-3.5' />
											</Button>
											<Button
												variant='outline'
												size='icon'
												className='h-8 w-8'
												onClick={() => handleDeleteClick(resource.id)}
											>
												<Trash2 className='h-3.5 w-3.5' />
											</Button>
										</div>
									</div>
								</CardHeader>
							</Card>
						))
					)}
				</div>

				<ResourceDialog
					open={dialogOpen}
					onOpenChange={setDialogOpen}
					resource={editingResource}
				/>

				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Resource</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this resource? This action cannot be
								undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel
								onClick={handleDeleteCancel}
								disabled={deleteMutation.isPending}
							>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteConfirm}
								disabled={deleteMutation.isPending}
							>
								{deleteMutation.isPending && (
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
								)}
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}
