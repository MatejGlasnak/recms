'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'

export interface ShowPageHeaderProps {
	defaultTitle: string
	defaultDescription: string
	editMode: boolean
	onEditModeToggle: () => void
	onBack: () => void
	backLabel: string
}

export function ShowPageHeader({
	defaultTitle,
	defaultDescription,
	editMode,
	onEditModeToggle,
	onBack,
	backLabel
}: ShowPageHeaderProps) {
	return (
		<div className='space-y-6'>
			<div className='flex items-start justify-between gap-4'>
				<div className='space-y-2 flex-1'>
					<h1 className='text-3xl font-bold tracking-tight'>{defaultTitle}</h1>
					<p className='text-muted-foreground text-sm'>{defaultDescription}</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant={editMode ? 'default' : 'outline'}
						size='sm'
						onClick={onEditModeToggle}
					>
						<Pencil className='h-4 w-4 mr-2' />
						{editMode ? 'Done' : 'Edit'}
					</Button>
				</div>
			</div>
			<div className='flex items-center justify-between gap-4'>
				<Button variant='ghost' size='sm' onClick={onBack}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					{backLabel}
				</Button>
			</div>
		</div>
	)
}
