'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePageSetup } from '@/lib/contexts/page-context'
import { useResource, useCreateResource, useUpdateResource } from '@/lib/hooks/use-resources'

const resourceSchema = z.object({
	name: z.string().min(1, 'Resource name is required'),
	label: z.string().min(1, 'Resource label is required'),
	endpoint: z.string().min(1, 'API endpoint is required')
})

type ResourceFormValues = z.infer<typeof resourceSchema>

export default function ResourceEditPage({ params }: { params: { id: string } }) {
	const router = useRouter()
	const isNew = params.id === 'new'

	usePageSetup(isNew ? 'Add Resource' : 'Edit Resource', [
		{ label: 'Settings', href: '/admin/settings' },
		{ label: 'Configuration', href: '/admin/settings/configuration' },
		{ label: 'Resources', href: '/admin/settings/configuration/resources' },
		{ label: isNew ? 'New' : 'Edit' }
	])

	const { data: resource, isLoading } = useResource(params.id)
	const createMutation = useCreateResource()
	const updateMutation = useUpdateResource(params.id)

	const form = useForm<ResourceFormValues>({
		resolver: zodResolver(resourceSchema),
		defaultValues: {
			name: '',
			label: '',
			endpoint: ''
		}
	})

	// Update form when resource data is loaded
	useEffect(() => {
		if (resource) {
			form.reset({
				name: resource.name,
				label: resource.label,
				endpoint: resource.endpoint
			})
		}
	}, [resource, form])

	const onSubmit = async (data: ResourceFormValues) => {
		const mutation = isNew ? createMutation : updateMutation

		mutation.mutate(data, {
			onSuccess: () => {
				router.push('/admin/settings/configuration/resources')
			}
		})
	}

	const isSaving = createMutation.isPending || updateMutation.isPending

	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex flex-col gap-4 p-4 md:p-6'>
				<div className='flex flex-col gap-1'>
					<h1 className='text-2xl font-semibold tracking-tight'>
						{isNew ? 'Add Resource' : 'Edit Resource'}
					</h1>
					<p className='text-sm text-muted-foreground'>
						{isNew
							? 'Configure a new external REST API resource'
							: 'Update the resource configuration'}
					</p>
				</div>

				<Card>
					<CardHeader className='p-4 pb-3'>
						<CardTitle className='text-base font-medium'>
							Resource Configuration
						</CardTitle>
						<CardDescription className='text-xs'>
							Define the resource identifier, label, and API endpoint
						</CardDescription>
					</CardHeader>
					<CardContent className='p-4 pt-0'>
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
									Human-readable name shown in the UI (e.g., sidebar, settings)
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
									Internal identifier for this resource (use kebab-case, e.g.,
									post-categories, user-profiles)
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

							<div className='flex gap-2 pt-2'>
								<Button type='submit' size='sm' disabled={isSaving || isLoading}>
									{isSaving && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
									{isSaving
										? 'Saving...'
										: isNew
										? 'Create Resource'
										: 'Save Changes'}
								</Button>
								<Link href='/admin/settings/configuration/resources'>
									<Button
										type='button'
										variant='outline'
										size='sm'
										disabled={isSaving}
									>
										Cancel
									</Button>
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
