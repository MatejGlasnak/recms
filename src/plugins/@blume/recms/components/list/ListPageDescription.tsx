'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { useUpdateListConfig } from '../../hooks'
import type { ListConfig } from '../../types'
import { EditableWrapper } from '../ui/EditableWrapper'

const formSchema = z.object({
	description: z.string().min(1, 'Description is required')
})

type FormValues = z.infer<typeof formSchema>

export interface ListPageDescriptionProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	defaultDescription: string
}

export function ListPageDescription({
	resourceId,
	currentConfig,
	editMode,
	defaultDescription
}: ListPageDescriptionProps) {
	const [dialogOpen, setDialogOpen] = useState(false)
	const updateMutation = useUpdateListConfig(resourceId)

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { description: '' }
	})

	useEffect(() => {
		if (currentConfig) {
			form.reset({
				description: currentConfig.meta?.description || defaultDescription
			})
		}
	}, [currentConfig, defaultDescription, form])

	const onSubmit = async (values: FormValues) => {
		try {
			await updateMutation.mutateAsync({
				meta: {
					...currentConfig?.meta,
					description: values.description
				}
			})
			setDialogOpen(false)
		} catch (error) {
			console.error('Error updating description:', error)
		}
	}

	const displayDescription = currentConfig?.meta?.description || defaultDescription

	return (
		<>
			<EditableWrapper
				editMode={editMode}
				onEditClick={() => setDialogOpen(true)}
				className='p-2'
			>
				<p className='text-muted-foreground'>{displayDescription}</p>
			</EditableWrapper>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Edit Description</DialogTitle>
						<DialogDescription>
							Update the description for this list page.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder='Enter page description'
												rows={3}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button
									type='button'
									variant='outline'
									onClick={() => setDialogOpen(false)}
									disabled={updateMutation.isPending}
								>
									Cancel
								</Button>
								<Button type='submit' disabled={updateMutation.isPending}>
									{updateMutation.isPending && (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									)}
									Save Changes
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	)
}
