'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Pencil, Check } from 'lucide-react'
import type { BlockComponentProps } from '../../../core/registries/types'
import { EditableWrapper } from '../../../ui/EditableWrapper'
import { FormModal } from '../../../ui/FormModal'
import { showHeaderConfig } from './config'

export interface ShowHeaderConfig {
	title?: string
	description?: string
	showEdit?: boolean
	showDelete?: boolean
	showBack?: boolean
	// Runtime props
	onEditModeToggle?: () => void
}

export interface ShowHeaderProps extends BlockComponentProps {
	resourceId: string
	defaultTitle?: string
	defaultDescription?: string
	recordId?: string
}

export function ShowHeader({
	blockConfig,
	editMode,
	resourceId,
	defaultTitle,
	defaultDescription,
	recordId,
	onConfigUpdate,
	onDelete
}: ShowHeaderProps) {
	const router = useRouter()
	const config = blockConfig.config as ShowHeaderConfig
	const [showConfigModal, setShowConfigModal] = useState(false)

	const title = config.title || defaultTitle || 'Detail View'
	const description = config.description || defaultDescription
	const showEdit = config.showEdit !== false
	const showDelete = config.showDelete === true
	const showBack = config.showBack !== false

	const handleBack = () => {
		router.push(`/admin/resources/${resourceId}`)
	}

	const handleEdit = () => {
		router.push(`/admin/resources/${resourceId}/edit/${recordId}`)
	}

	const handleDelete = () => {
		// TODO: Implement delete functionality
		console.log('Delete record:', recordId)
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

	return (
		<>
			<EditableWrapper
				editMode={editMode || false}
				onEditClick={() => editMode && setShowConfigModal(true)}
			>
				<div className='flex items-center justify-between'>
					<div className='flex-1 space-y-1'>
						<div className='flex items-center gap-3'>
							{showBack && (
								<Button
									variant='ghost'
									size='icon'
									onClick={handleBack}
									className='shrink-0'
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
						{/* Record edit button */}
						{showEdit && !editMode && (
							<Button variant='outline' size='sm' onClick={handleEdit}>
								<Edit className='h-4 w-4 mr-2' />
								Edit
							</Button>
						)}
						{/* Record delete button */}
						{showDelete && !editMode && (
							<Button variant='destructive' size='sm' onClick={handleDelete}>
								<Trash2 className='h-4 w-4 mr-2' />
								Delete
							</Button>
						)}
					</div>
				</div>
			</EditableWrapper>

			{/* Configuration Modal */}
			<FormModal
				open={showConfigModal}
				onOpenChange={setShowConfigModal}
				title='Configure Header'
				description='Configure the show page header settings'
				fieldConfig={showHeaderConfig}
				initialValues={config}
				onSubmit={handleConfigUpdate}
				onDelete={onDelete ? handleDeleteBlock : undefined}
			/>
		</>
	)
}
