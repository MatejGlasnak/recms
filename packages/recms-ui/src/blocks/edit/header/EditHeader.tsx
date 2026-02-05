'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, X, AlertCircle, Pencil, Check } from 'lucide-react'
import type { BlockComponentProps } from '@blume/recms-core'
import { EditableWrapper } from '../../../components/index.ts'
import { FormModal } from '../../../components/index.ts'
import { editHeaderConfig } from './config'
import { Alert, AlertDescription } from '@/components/ui/alert'

export interface EditHeaderConfig {
	title?: string
	description?: string
	showSave?: boolean
	showCancel?: boolean
	showBack?: boolean
	// Runtime props
	onEditModeToggle?: () => void
}

export interface EditHeaderProps extends BlockComponentProps {
	resourceId: string
	defaultTitle?: string
	defaultDescription?: string
	recordId?: string
	onSave?: (fields: any[]) => void
	onCancel?: () => void
	isSaving?: boolean
	hasChanges?: boolean
	validationErrors?: Record<string, string>
}

export function EditHeader({
	blockConfig,
	editMode,
	resourceId,
	defaultTitle,
	defaultDescription,
	recordId,
	onSave,
	onCancel,
	isSaving,
	hasChanges,
	validationErrors = {},
	onConfigUpdate,
	onDelete
}: EditHeaderProps) {
	const config = blockConfig.config as EditHeaderConfig
	const [showConfigModal, setShowConfigModal] = useState(false)

	const title = config.title || defaultTitle || 'Edit Record'
	const description = config.description || defaultDescription
	const showSave = config.showSave !== false
	const showCancel = config.showCancel !== false
	const showBack = config.showBack !== false

	const handleSave = () => {
		if (onSave) {
			// Pass empty fields array for now - will be enhanced later
			onSave([])
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
										disabled={isSaving}
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
									disabled={isSaving}
								>
									<X className='h-4 w-4 mr-2' />
									Cancel
								</Button>
							)}
							{showSave && !editMode && (
								<Button
									variant='default'
									size='sm'
									onClick={handleSave}
									disabled={isSaving || !hasChanges}
								>
									<Save className='h-4 w-4 mr-2' />
									{isSaving ? 'Saving...' : 'Save'}
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
				description='Configure the edit page header settings'
				fieldConfig={editHeaderConfig}
				initialValues={config as Record<string, unknown>}
				onSubmit={handleConfigUpdate}
				onDelete={onDelete ? handleDeleteBlock : undefined}
			/>
		</>
	)
}
