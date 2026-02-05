'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCreate } from '@refinedev/core'
import { useMemo, useState, useCallback } from 'react'
import { PageWrapper } from '../wrappers/PageWrapper'
import { useResources } from '@/lib/hooks/use-resources'
import { formatHeader } from '../../utils'

export interface CreatePageProps {
	resourceId?: string
}

/**
 * CreatePage component
 * Uses PageWrapper for rendering, handles create-specific form submission
 */
export function CreatePage({ resourceId: resourceIdProp }: CreatePageProps) {
	const params = useParams()
	const router = useRouter()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''

	// Form state
	const [formValues, setFormValues] = useState<Record<string, unknown>>({})
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

	// Resource metadata
	const { data: resources = [], isLoading: isResourcesLoading } = useResources()
	const resourceDef = useMemo(
		() => resources.find(r => r.name === resourceId),
		[resources, resourceId]
	)

	const resourceLabel =
		resourceDef?.label ?? (isResourcesLoading ? 'Loading…' : formatHeader(resourceId))

	// Create mutation
	const createMutation = useCreate()
	const isCreating = createMutation.isPending || false

	// Handle field change
	const handleFieldChange = useCallback(
		(name: string, value: unknown) => {
			setFormValues(prev => ({ ...prev, [name]: value }))
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

	// Handle create
	const handleCreate = useCallback(
		async (fields: any[]) => {
			// Validate form
			if (!validateForm(fields)) {
				return
			}

			createMutation.mutate(
				{
					resource: resourceId,
					values: formValues,
					dataProviderName: 'external',
					meta: { endpoint: resourceDef?.endpoint }
				},
				{
					onSuccess: data => {
						const newId = (data.data as any)?.id
						if (newId) {
							router.push(`/admin/resources/${resourceId}/show/${newId}`)
						} else {
							router.push(`/admin/resources/${resourceId}`)
						}
					},
					onError: (error: any) => {
						console.error('Create error:', error)
						setValidationErrors({
							_form: error?.message || 'Failed to create record'
						})
					}
				}
			)
		},
		[formValues, resourceId, resourceDef?.endpoint, createMutation, router, validateForm]
	)

	// Handle cancel
	const handleCancel = useCallback(() => {
		router.push(`/admin/resources/${resourceId}`)
	}, [router, resourceId])

	// Props map for blocks
	const additionalPropsMap = {
		'create-header': {
			resourceId,
			defaultTitle: `Create ${resourceLabel}`,
			defaultDescription: `Add a new ${resourceLabel.toLowerCase()} to the system.`,
			onCreate: handleCreate,
			onCancel: handleCancel,
			isCreating,
			validationErrors
		},
		'create-content': {
			values: formValues,
			onChange: handleFieldChange,
			errors: validationErrors
		},
		tabs: {
			values: formValues,
			onChange: handleFieldChange,
			errors: validationErrors
		},
		grid: {
			values: formValues,
			onChange: handleFieldChange,
			errors: validationErrors
		}
	}

	return (
		<PageWrapper
			pageType='create'
			resourceId={resourceId}
			data={[]}
			isLoading={isResourcesLoading}
			isError={false}
			error={null}
			additionalPropsMap={additionalPropsMap}
		/>
	)
}
