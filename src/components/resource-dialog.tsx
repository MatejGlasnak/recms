'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useCreateResource, useUpdateResource } from '@/lib/hooks/use-resources'
import type { Resource } from '@/lib/types/resources'

const resourceSchema = z.object({
	name: z.string().min(1, 'Resource name is required'),
	label: z.string().min(1, 'Resource label is required'),
	endpoint: z.string().min(1, 'API endpoint is required')
})

type ResourceFormValues = z.infer<typeof resourceSchema>

interface ResourceDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	resource?: Resource
}

export function ResourceDialog({ open, onOpenChange, resource }: ResourceDialogProps) {
	const isEdit = !!resource
	const createMutation = useCreateResource()
	const updateMutation = useUpdateResource(resource?.id || '')

	const form = useForm<ResourceFormValues>({
		resolver: zodResolver(resourceSchema),
		defaultValues: {
			name: '',
			label: '',
			endpoint: ''
		}
	})

	// Reset form when dialog opens/closes or resource changes
	useEffect(() => {
		if (open) {
			if (resource) {
				form.reset({
					name: resource.name,
					label: resource.label,
					endpoint: resource.endpoint
				})
			} else {
				form.reset({
					name: '',
					label: '',
					endpoint: ''
				})
			}
		}
	}, [open, resource, form])

	const onSubmit = async (data: ResourceFormValues) => {
		const mutation = isEdit ? updateMutation : createMutation

		mutation.mutate(data, {
			onSuccess: () => {
				onOpenChange(false)
			}
		})
	}

	const isSaving = createMutation.isPending || updateMutation.isPending

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
					<DialogDescription>
						{isEdit
							? 'Update the resource configuration'
							: 'Configure a new external REST API resource'}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='label' className='text-sm'>
							Display Label
						</Label>
						<Input
							id='label'
							placeholder='e.g., Blog Categories'
							{...form.register('label')}
							className='h-9'
						/>
						{form.formState.errors.label && (
							<p className='text-xs text-destructive'>
								{form.formState.errors.label.message}
							</p>
						)}
						<p className='text-xs text-muted-foreground'>
							Human-readable name shown in the UI
						</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='name' className='text-sm'>
							Resource Name
						</Label>
						<Input
							id='name'
							placeholder='e.g., blog-categories'
							{...form.register('name')}
							className='h-9'
						/>
						{form.formState.errors.name && (
							<p className='text-xs text-destructive'>
								{form.formState.errors.name.message}
							</p>
						)}
						<p className='text-xs text-muted-foreground'>
							Internal identifier (use kebab-case, e.g., post-categories,
							user-profiles)
						</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='endpoint' className='text-sm'>
							API Endpoint
						</Label>
						<Input
							id='endpoint'
							placeholder='e.g., v1/admin/blog/categories'
							{...form.register('endpoint')}
							className='h-9'
						/>
						{form.formState.errors.endpoint && (
							<p className='text-xs text-destructive'>
								{form.formState.errors.endpoint.message}
							</p>
						)}
						<p className='text-xs text-muted-foreground'>
							The base URL path for this resource&apos;s REST API
						</p>
					</div>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
							disabled={isSaving}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={isSaving}>
							{isSaving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
							{isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Resource'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
