'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Check } from 'lucide-react'
import type { BlockComponentProps } from '@blume/recms-core'
import { useState } from 'react'
import { FormModal } from '../../../components/index.ts'
import { listHeaderConfig } from './config'

export interface ListHeaderProps extends BlockComponentProps {
	defaultTitle?: string
	defaultDescription?: string
}

export function ListHeader({
	blockConfig,
	editMode,
	resourceId,
	defaultTitle,
	defaultDescription,
	onConfigUpdate,
	onDelete
}: ListHeaderProps) {
	const [showSettings, setShowSettings] = useState(false)
	const config = blockConfig.config as {
		title?: string
		description?: string
		onEditModeToggle?: () => void
	}

	const title = config.title || defaultTitle
	const description = config.description || defaultDescription

	const handleSaveSettings = async (values: Record<string, unknown>) => {
		if (onConfigUpdate) {
			// Preserve runtime props like onEditModeToggle
			await onConfigUpdate(blockConfig.id, {
				...values,
				onEditModeToggle: config.onEditModeToggle
			})
		}
		setShowSettings(false)
	}

	const handleDelete = async () => {
		if (onDelete && typeof onDelete === 'function') {
			await onDelete()
		}
	}

	return (
		<>
			<div
				className={`flex items-center justify-between ${
					editMode
						? 'cursor-pointer rounded-lg border border-dashed border-primary/40 p-3 hover:border-solid hover:border-primary'
						: ''
				}`}
				onClick={editMode ? () => setShowSettings(true) : undefined}
			>
				<div className='flex flex-col gap-2'>
					{title && <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>}
					{description && <p className='text-sm text-muted-foreground'>{description}</p>}
				</div>
				{editMode !== undefined && config.onEditModeToggle && (
					<Button
						variant={editMode ? 'default' : 'ghost'}
						size='sm'
						onClick={e => {
							e.stopPropagation()
							config.onEditModeToggle?.()
						}}
					>
						{editMode ? (
							<>
								<Check className='mr-2 size-4' />
								Done
							</>
						) : (
							<>
								<Pencil className='mr-2 size-4' />
								Configure
							</>
						)}
					</Button>
				)}
			</div>

			<FormModal
				open={showSettings}
				onOpenChange={setShowSettings}
				title='Header Settings'
				description='Configure the list page header'
				fieldConfig={listHeaderConfig}
				initialValues={config}
				onSubmit={handleSaveSettings}
				onDelete={onDelete ? handleDelete : undefined}
			/>
		</>
	)
}
