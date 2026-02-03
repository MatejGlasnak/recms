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
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useUpdateListConfig } from '../../hooks'
import type { ListConfig } from '../../types'
import { EditableWrapper } from '../ui/EditableWrapper'

const formSchema = z.object({
	title: z.string().min(1, 'Title is required')
})

type FormValues = z.infer<typeof formSchema>

export interface ListPageTitleProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	defaultTitle: string
}

export function ListPageTitle({
	resourceId,
	currentConfig,
	editMode,
	defaultTitle
}: ListPageTitleProps) {
	const [dialogOpen, setDialogOpen] = useState(false)
	const updateMutation = useUpdateListConfig(resourceId)

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { title: '' }
	})

	useEffect(() => {
		if (currentConfig) {
			form.reset({
				title: currentConfig.meta?.title || defaultTitle
			})
		}
	}, [currentConfig, defaultTitle, form])

	const onSubmit = async (values: FormValues) => {
		try {
			await updateMutation.mutateAsync({
				meta: {
					...currentConfig?.meta,
					title: values.title
				}
			})
			setDialogOpen(false)
		} catch (error) {
			console.error('Error updating title:', error)
		}
	}

	const displayTitle = currentConfig?.meta?.title || defaultTitle

	return (
		<>
			<EditableWrapper
				editMode={editMode}
				onEditClick={() => setDialogOpen(true)}
				className='p-2'
			>
				<h1 className='text-3xl font-bold tracking-tight'>{displayTitle}</h1>
			</EditableWrapper>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className='sm:max-w-[500px]'>
					<DialogHeader>
						<DialogTitle>Edit Page Title</DialogTitle>
						<DialogDescription>Update the title for this list page.</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder='Enter page title' {...field} />
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
