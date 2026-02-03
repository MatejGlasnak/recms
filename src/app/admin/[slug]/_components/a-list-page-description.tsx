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
import { useUpdateListConfig } from '@/lib/hooks/use-list-config'
import type { ListConfig } from '@/lib/types/list-config'

const formSchema = z.object({
	description: z.string().min(1, 'Description is required')
})

type FormValues = z.infer<typeof formSchema>

interface AListPageDescriptionProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	defaultDescription: string
}

export function AListPageDescription({
	resourceId,
	currentConfig,
	editMode,
	defaultDescription
}: AListPageDescriptionProps) {
	const [dialogOpen, setDialogOpen] = useState(false)
	const updateMutation = useUpdateListConfig(resourceId)

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: ''
		}
	})

	// Update form values when config changes
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
			{editMode ? (
				<div
					className='cursor-pointer transition-all border-2 border-dashed border-muted-foreground/30 rounded-md p-2 hover:border-muted-foreground/60 hover:bg-muted/30'
					onClick={() => setDialogOpen(true)}
				>
					<p className='text-muted-foreground'>{displayDescription}</p>
				</div>
			) : (
				<p className='text-muted-foreground'>{displayDescription}</p>
			)}

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
