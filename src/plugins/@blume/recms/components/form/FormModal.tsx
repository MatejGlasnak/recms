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

	const renderFields = (fields: typeof fieldConfig.fields) => (
		<div className='grid grid-cols-12 gap-4'>
			{fields
				.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
				.map(field => {
					// Use custom renderer if provided
					if (field.renderer) {
						const CustomRenderer = field.renderer
						return (
							<div key={field.name} className={`col-span-12 ${field.cssClass ?? ''}`}>
								{field.label && (
									<label className='block text-sm font-medium mb-2'>
										{field.label}
										{field.required && (
											<span className='text-destructive ml-1'>*</span>
										)}
									</label>
								)}
								<CustomRenderer
									value={values[field.name]}
									onChange={value => handleChange(field.name, value)}
									field={field}
								/>
								{errors[field.name] && (
									<p className='text-sm text-destructive mt-1'>
										{errors[field.name]}
									</p>
								)}
								{field.comment && (
									<p className='text-sm text-muted-foreground mt-1'>
										{field.comment}
									</p>
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
				})}
		</div>
	)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>

				{errors._form && (
					<div className='rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
						{errors._form}
					</div>
				)}

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
							<TabsContent key={tab.name} value={tab.name} className='space-y-4 pt-4'>
								{renderFields(fieldsByTab.get(tab.name) ?? [])}
							</TabsContent>
						))}
					</Tabs>
				) : (
					<div className='space-y-4'>{renderFields(fieldsByTab.get('_all') ?? [])}</div>
				)}

				<DialogFooter className={onDelete ? 'justify-between' : ''}>
					{onDelete && (
						<Button
							variant='destructive'
							onClick={handleDelete}
							disabled={isSubmitting || isDeleting}
						>
							{isDeleting ? 'Deleting...' : deleteLabel}
						</Button>
					)}
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
