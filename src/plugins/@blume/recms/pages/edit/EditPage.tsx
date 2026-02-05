'use client'

import { useParams, useRouter } from 'next/navigation'
import { useOne, useUpdate } from '@refinedev/core'
import { useMemo, useState, useCallback } from 'react'
import { PageWrapper } from '../wrappers/PageWrapper'
import { useResources } from '@/lib/hooks/use-resources'
import { formatHeader } from '../../utils'

export interface EditPageProps {
	resourceId?: string
	id?: string
}

/**
 * EditPage component
 * Uses PageWrapper for rendering, handles edit-specific data fetching and form submission
 */
export function EditPage({ resourceId: resourceIdProp, id: idProp }: EditPageProps) {
	const params = useParams()
	const router = useRouter()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''
	const id = idProp ?? (params?.id as string) ?? ''

	// Form state
	const [formValues, setFormValues] = useState<Record<string, unknown>>({})
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
	const [hasChanges, setHasChanges] = useState(false)

	// Resource metadata
	const { data: resources = [], isLoading: isResourcesLoading } = useResources()
	const resourceDef = useMemo(
		() => resources.find(r => r.name === resourceId),
		[resources, resourceId]
	)

	const resourceLabel =
		resourceDef?.label ?? (isResourcesLoading ? 'Loading…' : formatHeader(resourceId))

	// Fetch record data
	const { result, query } = useOne({
		resource: resourceId,
		id,
		dataProviderName: 'external',
		meta: { endpoint: resourceDef?.endpoint },
		queryOptions: {
			enabled: !!resourceDef?.endpoint
		}
	})

	const record = (result?.data as Record<string, unknown>) ?? null

	// Initialize form values when record loads
	useMemo(() => {
		if (record && !hasChanges) {
			setFormValues(record)
		}
	}, [record, hasChanges])

	// Update mutation
	const updateMutation = useUpdate()
	const isUpdating = updateMutation.isPending || false

	// Handle field change
	const handleFieldChange = useCallback(
		(name: string, value: unknown) => {
			setFormValues(prev => ({ ...prev, [name]: value }))
			setHasChanges(true)
			// Clear validation error for this field
			if (validationErrors[name]) {
				setValidationErrors(prev => {
					const newErrors = { ...prev }
					delete newErrors[name]
					return newErrors
				})
			}
		},
		[validationErrors]
	)

	// Validate form
	const validateForm = useCallback(
		(fields: any[]): boolean => {
			const newErrors: Record<string, string> = {}

			fields.forEach(field => {
				if (field.required && !formValues[field.name]) {
					newErrors[field.name] = `${field.label ?? field.name} is required`
				}
			})

			setValidationErrors(newErrors)
			return Object.keys(newErrors).length === 0
		},
		[formValues]
	)

	// Handle save
	const handleSave = useCallback(
		async (fields: any[]) => {
			// Validate form
			if (!validateForm(fields)) {
				return
			}

			updateMutation.mutate(
				{
					resource: resourceId,
					id,
					values: formValues,
					dataProviderName: 'external',
					meta: { endpoint: resourceDef?.endpoint }
				},
				{
					onSuccess: () => {
						setHasChanges(false)
						router.push(`/admin/resources/${resourceId}/show/${id}`)
					},
					onError: (error: any) => {
						console.error('Update error:', error)
						setValidationErrors({
							_form: error?.message || 'Failed to update record'
						})
					}
				}
			)
		},
		[formValues, resourceId, id, resourceDef?.endpoint, updateMutation, router, validateForm]
	)

	// Handle cancel
	const handleCancel = useCallback(() => {
		router.push(`/admin/resources/${resourceId}/show/${id}`)
	}, [router, resourceId, id])

	// Props map for blocks
	const additionalPropsMap = {
		'edit-header': {
			resourceId,
			recordId: id,
			defaultTitle: `Edit ${resourceLabel} #${id}`,
			defaultDescription: `Update the details of this ${resourceLabel.toLowerCase()}.`,
			onSave: handleSave,
			onCancel: handleCancel,
			isSaving: isUpdating,
			hasChanges,
			validationErrors
		},
		'edit-content': {
			record,
			values: formValues,
			onChange: handleFieldChange,
			errors: validationErrors
		},
		tabs: {
			record,
			values: formValues,
			onChange: handleFieldChange,
			errors: validationErrors
		},
		grid: {
			record,
			values: formValues,
			onChange: handleFieldChange,
			errors: validationErrors
		}
	}

	return (
		<PageWrapper
			pageType='edit'
			resourceId={resourceId}
			recordId={id}
			data={record ? [record] : []}
			isLoading={query.isLoading || isResourcesLoading}
			isError={query.isError}
			error={query.error}
			additionalPropsMap={additionalPropsMap}
		/>
	)
}
