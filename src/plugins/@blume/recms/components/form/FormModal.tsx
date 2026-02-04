'use client'

import { useEffect, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormField } from './FormField'
import type { BlockFieldConfig } from '../registry/BlockRegistry'

export interface FormModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description?: string
	fieldConfig: BlockFieldConfig
	initialValues?: Record<string, unknown>
	onSubmit: (values: Record<string, unknown>) => void | Promise<void>
	onDelete?: () => void | Promise<void>
	submitLabel?: string
	cancelLabel?: string
	deleteLabel?: string
}

export function FormModal({
	open,
	onOpenChange,
	title,
	description,
	fieldConfig,
	initialValues = {},
	onSubmit,
	onDelete,
	submitLabel = 'Save',
	cancelLabel = 'Cancel',
	deleteLabel = 'Delete'
}: FormModalProps) {
	const [values, setValues] = useState<Record<string, unknown>>(initialValues)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	// Reset values when modal opens
	useEffect(() => {
		if (open) {
			setValues(initialValues)
			setErrors({})
		}
	}, [open, initialValues])

	const handleChange = (name: string, value: unknown) => {
		setValues(prev => ({ ...prev, [name]: value }))
		// Clear error for this field
		if (errors[name]) {
			setErrors(prev => {
				const newErrors = { ...prev }
				delete newErrors[name]
				return newErrors
			})
		}
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		fieldConfig.fields.forEach(field => {
			if (field.required && !values[field.name]) {
				newErrors[field.name] = `${field.label ?? field.name} is required`
			}
		})

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async () => {
		if (!validateForm()) {
			return
		}

		setIsSubmitting(true)
		try {
			await onSubmit(values)
			onOpenChange(false)
		} catch (error) {
			console.error('Form submission error:', error)
			setErrors({
				_form: error instanceof Error ? error.message : 'Failed to submit form'
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDelete = async () => {
		if (!onDelete) return

		setIsDeleting(true)
		try {
			await onDelete()
			onOpenChange(false)
		} catch (error) {
			console.error('Delete error:', error)
			setErrors({
				_form: error instanceof Error ? error.message : 'Failed to delete'
			})
		} finally {
			setIsDeleting(false)
		}
	}

	// Group fields by tab
	const hasTabs = fieldConfig.tabs && fieldConfig.tabs.length > 0
	const fieldsByTab = new Map<string, typeof fieldConfig.fields>()

	if (hasTabs && fieldConfig.tabs) {
		// Initialize tabs
		fieldConfig.tabs.forEach(tab => {
			fieldsByTab.set(tab.name, [])
		})
		// Add a default tab for fields without a tab
		fieldsByTab.set('_default', [])

		// Group fields
		fieldConfig.fields.forEach(field => {
			const tabName = field.tab ?? '_default'
			const existing = fieldsByTab.get(tabName) ?? []
			fieldsByTab.set(tabName, [...existing, field])
		})
	} else {
		fieldsByTab.set('_all', fieldConfig.fields)
	}

	const getGridColsClass = (columns: number) => {
		const colsMap: Record<number, string> = {
			1: 'grid-cols-1',
			2: 'grid-cols-2',
			3: 'grid-cols-3',
			4: 'grid-cols-4',
			5: 'grid-cols-5',
			6: 'grid-cols-6',
			7: 'grid-cols-7',
			8: 'grid-cols-8',
			9: 'grid-cols-9',
			10: 'grid-cols-10',
			11: 'grid-cols-11',
			12: 'grid-cols-12'
		}
		return colsMap[columns] || 'grid-cols-6'
	}

	const renderField = (field: (typeof fieldConfig.fields)[0]): React.ReactNode => {
		// Handle group fields
		if (field.type === 'group' && field.fields) {
			const columns = field.columns ?? 6
			return (
				<div key={field.name} className='space-y-3'>
					{field.label && (
						<h3 className='text-sm font-semibold text-muted-foreground'>
							{field.label}
						</h3>
					)}
					<div className={`grid ${getGridColsClass(columns)} gap-4`}>
						{field.fields.map(nestedField => renderField(nestedField))}
					</div>
					{field.comment && (
						<p className='text-sm text-muted-foreground'>{field.comment}</p>
					)}
				</div>
			)
		}

		// Use custom renderer if provided
		if (field.renderer) {
			const CustomRenderer = field.renderer
			return (
				<div key={field.name} className={field.cssClass ?? ''}>
					<CustomRenderer
						value={values[field.name]}
						onChange={value => handleChange(field.name, value)}
						field={field}
					/>
					{errors[field.name] && (
						<p className='text-sm text-destructive mt-1'>{errors[field.name]}</p>
					)}
				</div>
			)
		}

		// Use default FormField for standard types
		return (
			<FormField
				key={field.name}
				field={field}
				value={values[field.name]}
				onChange={value => handleChange(field.name, value)}
				error={errors[field.name]}
				allValues={values}
			/>
		)
	}

	const renderFields = (fields: typeof fieldConfig.fields) => {
		const sortedFields = fields.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

		return <div className='space-y-8'>{sortedFields.map(field => renderField(field))}</div>
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-4xl'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>

				{errors._form && (
					<div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
						{errors._form}
					</div>
				)}

				<div className='py-4'>
					{hasTabs && fieldConfig.tabs ? (
						<Tabs defaultValue={fieldConfig.tabs[0]?.name} className='w-full'>
							<TabsList className='w-full justify-start'>
								{fieldConfig.tabs.map(tab => (
									<TabsTrigger key={tab.name} value={tab.name}>
										{tab.label}
									</TabsTrigger>
								))}
							</TabsList>
							{fieldConfig.tabs.map(tab => (
								<TabsContent key={tab.name} value={tab.name} className='pt-6'>
									{renderFields(fieldsByTab.get(tab.name) ?? [])}
								</TabsContent>
							))}
						</Tabs>
					) : (
						renderFields(fieldsByTab.get('_all') ?? [])
					)}
				</div>

				<DialogFooter className='!justify-between'>
					<div className='flex gap-2'>
						{onDelete && (
							<Button
								variant='destructive'
								onClick={handleDelete}
								disabled={isSubmitting || isDeleting}
							>
								{isDeleting ? 'Deleting...' : deleteLabel}
							</Button>
						)}
					</div>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting || isDeleting}
						>
							{cancelLabel}
						</Button>
						<Button onClick={handleSubmit} disabled={isSubmitting || isDeleting}>
							{isSubmitting ? 'Saving...' : submitLabel}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
