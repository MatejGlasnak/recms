'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft } from 'lucide-react'
import { ShowPageHeader } from './ShowPageHeader'

export interface ShowPageLayoutProps {
	resourceId: string
	resourceMeta?: { label?: string }
	/** Page title (e.g. "Blog Post #123"). */
	defaultTitle: string
	/** Page description shown under the title. */
	defaultDescription: string
	isLoading: boolean
	isError: boolean
	editMode: boolean
	onEditModeToggle: () => void
	onBack: () => void
	children: ReactNode
}

export function ShowPageLayout({
	resourceId,
	resourceMeta,
	defaultTitle,
	defaultDescription,
	isLoading,
	isError,
	editMode,
	onEditModeToggle,
	onBack,
	children
}: ShowPageLayoutProps) {
	const backLabel = `Back to ${resourceMeta?.label ?? resourceId}`

	if (isLoading) {
		return (
			<div
				className='container w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6 flex flex-col items-center justify-center min-h-[24rem]'
				style={{ paddingTop: '24px' }}
			>
				<Button variant='outline' size='sm' disabled>
					<Spinner data-icon='inline-start' />
					Loading...
				</Button>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex flex-col items-center justify-center h-96 gap-4'>
				<div className='text-destructive'>Something went wrong loading the data.</div>
				<Button variant='outline' onClick={onBack}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{backLabel}
				</Button>
			</div>
		)
	}

	return (
		<div
			className='container w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6'
			style={{ paddingTop: '24px' }}
		>
			<ShowPageHeader
				defaultTitle={defaultTitle}
				defaultDescription={defaultDescription}
				editMode={editMode}
				onEditModeToggle={onEditModeToggle}
				onBack={onBack}
				backLabel={backLabel}
			/>
			{children}
		</div>
	)
}
