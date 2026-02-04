'use client'

import { useMemo } from 'react'
import { useFieldRegistry } from '../core/registries'
import type { ShowFieldConfig } from '../blocks/show/content/types'

export interface ShowFieldValueProps {
	value: unknown
	field: ShowFieldConfig
	record?: Record<string, unknown> | null
}

/**
 * Renders a field value using the appropriate form field component in disabled mode
 */
export function ShowFieldValue({ value, field, record }: ShowFieldValueProps) {
	const { getField } = useFieldRegistry()

	// Map show field types to form field types
	const fieldTypeMap: Record<string, string> = {
		text: 'text',
		number: 'number',
		date: 'text', // TODO: Add date field type
		richtext: 'textarea',
		boolean: 'checkbox',
		badge: 'text',
		json: 'textarea'
	}

	const formFieldType = fieldTypeMap[field.type] || 'text'
	const fieldDef = getField(formFieldType)

	// If no field component found, render as plain text
	if (!fieldDef?.Component) {
		return <span className='text-sm'>{String(value ?? '')}</span>
	}

	const FieldComponent = fieldDef.Component

	// Prepare field config for the form field
	const fieldConfig = useMemo(() => {
		const baseConfig: Record<string, unknown> = {
			name: field.field,
			label: field.label || field.field,
			type: formFieldType,
			disabled: true,
			readOnly: true
		}

		// Add type-specific config
		if (field.type === 'json') {
			baseConfig.rows = 10
		}

		if (field.type === 'richtext') {
			baseConfig.rows = 5
		}

		return baseConfig
	}, [field, formFieldType])

	// Format value for display
	const displayValue = useMemo(() => {
		if (value === null || value === undefined) {
			return ''
		}

		// Handle JSON
		if (field.type === 'json') {
			try {
				return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
			} catch {
				return String(value)
			}
		}

		// Handle boolean
		if (field.type === 'boolean') {
			return Boolean(value)
		}

		// Handle date
		if (field.type === 'date' && value) {
			try {
				const date = new Date(value as string)
				return date.toLocaleDateString()
			} catch {
				return String(value)
			}
		}

		return value
	}, [value, field.type])

	return (
		<div className='w-full'>
			<FieldComponent
				field={fieldConfig as any}
				value={displayValue}
				onChange={() => {}} // No-op since it's disabled
				disabled={true}
				readOnly={true}
			/>
		</div>
	)
}
