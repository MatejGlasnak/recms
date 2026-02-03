'use client'

import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import type { ListConfig } from '../../types'
import { ListPageTitle } from './ListPageTitle'
import { ListPageDescription } from './ListPageDescription'

export interface ListPageHeaderProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	onEditModeToggle: () => void
	defaultTitle: string
	defaultDescription: string
}

export function ListPageHeader({
	resourceId,
	currentConfig,
	editMode,
	onEditModeToggle,
	defaultTitle,
	defaultDescription
}: ListPageHeaderProps) {
	return (
		<div className='flex items-start justify-between gap-4'>
			<div className='space-y-2 flex-1'>
				<ListPageTitle
					resourceId={resourceId}
					currentConfig={currentConfig}
					editMode={editMode}
					defaultTitle={defaultTitle}
				/>
				<ListPageDescription
					resourceId={resourceId}
					currentConfig={currentConfig}
					editMode={editMode}
					defaultDescription={defaultDescription}
				/>
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
	)
}
