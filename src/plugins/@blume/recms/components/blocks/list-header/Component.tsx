'use client'

import { Button } from '@/components/ui/button'
import { Pencil, Check } from 'lucide-react'
import type { BlockComponentProps } from '../../registry'
import { useState } from 'react'
import { FormModal } from '../../form/FormModal'
import { listHeaderConfig } from './config'

export function ListHeader({
	blockConfig,
	editMode,
	resourceId,
	onConfigUpdate,
	onDelete
}: BlockComponentProps) {
	const [showSettings, setShowSettings] = useState(false)
	const config = blockConfig.config as {
		title?: string
		description?: string
		onEditModeToggle?: () => void
	}

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
				className={`flex items-center justify-between mb-6 ${
					editMode
						? 'p-3 border border-dashed border-primary/40 hover:border-primary hover:border-solid rounded-lg cursor-pointer'
						: ''
				}`}
				onClick={editMode ? () => setShowSettings(true) : undefined}
			>
				<div>
					{config.title && (
						<h1 className='text-3xl font-bold tracking-tight'>{config.title}</h1>
					)}
					{config.description && (
						<p className='text-muted-foreground mt-2'>{config.description}</p>
					)}
				</div>
				{editMode !== undefined && config.onEditModeToggle && (
					<Button
						variant={editMode ? 'default' : 'outline'}
						size='sm'
						onClick={e => {
							e.stopPropagation()
							config.onEditModeToggle?.()
						}}
					>
						{editMode ? (
							<>
								<Check className='mr-2 h-4 w-4' />
								Done
							</>
						) : (
							<>
								<Pencil className='mr-2 h-4 w-4' />
								Edit
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
