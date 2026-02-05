'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, X, AlertCircle, Pencil, Check } from 'lucide-react'
import type { BlockComponentProps } from '@blume/recms-core'
import { EditableWrapper } from '../../../components/index.ts'
import { FormModal } from '../../../components/index.ts'
import { createHeaderConfig } from './config'
import { Alert, AlertDescription } from '@/components/ui/alert'

export interface CreateHeaderConfig {
	title?: string
	description?: string
	showCreate?: boolean
	showCancel?: boolean
	showBack?: boolean
	// Runtime props
	onEditModeToggle?: () => void
}

export interface CreateHeaderProps extends BlockComponentProps {
	resourceId: string
	defaultTitle?: string
	defaultDescription?: string
	onCreate?: (fields: any[]) => void
	onCancel?: () => void
	isCreating?: boolean
	validationErrors?: Record<string, string>
}

export function CreateHeader({
	blockConfig,
	editMode,
	resourceId,
	defaultTitle,
	defaultDescription,
	onCreate,
	onCancel,
	isCreating,
	validationErrors = {},
	onConfigUpdate,
	onDelete
}: CreateHeaderProps) {
	const config = blockConfig.config as CreateHeaderConfig
	const [showConfigModal, setShowConfigModal] = useState(false)

	const title = config.title || defaultTitle || 'Create Record'
	const description = config.description || defaultDescription
	const showCreate = config.showCreate !== false
	const showCancel = config.showCancel !== false
	const showBack = config.showBack !== false

	const handleCreate = () => {
		if (onCreate) {
			// Pass empty fields array for now - will be enhanced later
			onCreate([])
		}
	}

	const handleCancel = () => {
		if (onCancel) {
			onCancel()
		}
	}

	const handleConfigUpdate = async (values: Record<string, unknown>) => {
		if (onConfigUpdate) {
			await onConfigUpdate(blockConfig.id, values)
		}
		setShowConfigModal(false)
	}

	const handleDeleteBlock = async () => {
		if (onDelete && typeof onDelete === 'function') {
			await onDelete()
		}
	}

	const hasErrors = Object.keys(validationErrors).length > 0
	const formError = validationErrors._form

	return (
		<>
			<EditableWrapper
				editMode={editMode || false}
				onEditClick={() => editMode && setShowConfigModal(true)}
			>
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='flex-1 space-y-1'>
							<div className='flex items-center gap-3'>
								{showBack && (
									<Button
										variant='ghost'
										size='icon'
										onClick={handleCancel}
										className='shrink-0'
										disabled={isCreating}
									>
										<ArrowLeft className='h-4 w-4' />
									</Button>
								)}
								<div>
									<h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
									{description && (
										<p className='text-sm text-muted-foreground mt-1'>
											{description}
										</p>
									)}
								</div>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							{/* Page configuration toggle button */}
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
											<Check className='h-4 w-4 mr-2' />
											Done
										</>
									) : (
										<>
											<Pencil className='h-4 w-4 mr-2' />
											Configure
										</>
									)}
								</Button>
							)}
							{/* Record action buttons */}
							{showCancel && !editMode && (
								<Button
									variant='outline'
									size='sm'
									onClick={handleCancel}
									disabled={isCreating}
								>
									<X className='h-4 w-4 mr-2' />
									Cancel
								</Button>
							)}
							{showCreate && !editMode && (
								<Button
									variant='default'
									size='sm'
									onClick={handleCreate}
									disabled={isCreating}
								>
									<Plus className='h-4 w-4 mr-2' />
									{isCreating ? 'Creating...' : 'Create'}
								</Button>
							)}
						</div>
					</div>

					{/* Validation errors summary */}
					{hasErrors && formError && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertDescription>{formError}</AlertDescription>
						</Alert>
					)}
				</div>
			</EditableWrapper>

			{/* Configuration Modal */}
			<FormModal
				open={showConfigModal}
				onOpenChange={setShowConfigModal}
				title='Configure Header'
				description='Configure the create page header settings'
				fieldConfig={createHeaderConfig}
				initialValues={config}
				onSubmit={handleConfigUpdate}
				onDelete={onDelete ? handleDeleteBlock : undefined}
			/>
		</>
	)
}
