'use client'

import { useFieldRegistry } from '../registry/FieldRegistry'
import type { FieldDefinition } from '../registry/BlockRegistry'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
	field: FieldDefinition
	value: unknown
	onChange: (value: unknown) => void
	error?: string
	disabled?: boolean
	readOnly?: boolean
	allValues?: Record<string, unknown>
}

export function FormField({
	field,
	value,
	onChange,
	error,
	disabled,
	readOnly,
	allValues = {}
}: FormFieldProps) {
	const { getField } = useFieldRegistry()

	// Handle field visibility based on trigger conditions
	const isVisible = checkTriggerVisibility(field, allValues)
	if (!isVisible || field.hidden) {
		return null
	}

	const fieldDefinition = getField(field.type)

	if (!fieldDefinition) {
		console.warn(`Field type "${field.type}" not registered`)
		return (
			<div className='space-y-2'>
				<p className='text-sm text-destructive'>Unknown field type: {field.type}</p>
			</div>
		)
	}

	const FieldComponent = fieldDefinition.Component

	// Handle span layout
	const spanClasses = {
		auto: 'col-auto',
		left: 'col-span-6',
		right: 'col-span-6',
		row: 'col-span-12 grid grid-cols-2 gap-4',
		full: 'col-span-12'
	}

	const containerClass = cn(
		field.span && spanClasses[field.span],
		field.cssClass,
		field.stretch && 'h-full'
	)

	return (
		<div className={containerClass} {...field.containerAttributes}>
			<FieldComponent
				field={field}
				value={value}
				onChange={onChange}
				error={error}
				disabled={disabled || field.disabled}
				readOnly={readOnly || field.readOnly}
			/>
		</div>
	)
}

// Helper to check trigger visibility conditions
function checkTriggerVisibility(
	field: FieldDefinition,
	allValues: Record<string, unknown>
): boolean {
	if (!field.trigger) return true

	const { action, field: triggerField, condition } = field.trigger
	const triggerValue = allValues[triggerField]

	// Parse condition
	let shouldTrigger = false

	if (condition === 'checked') {
		shouldTrigger = Boolean(triggerValue)
	} else if (condition === 'unchecked') {
		shouldTrigger = !Boolean(triggerValue)
	} else if (condition.startsWith('value[')) {
		// Extract value(s) from condition like "value[somevalue]" or "value[val1][val2]"
		const matches = condition.match(/value\[([^\]]+)\]/g)
		if (matches) {
			const expectedValues = matches.map(m => m.match(/\[([^\]]+)\]/)?.[1]).filter(Boolean)

			// Handle array values (for checkboxlist, taglist, etc.)
			if (Array.isArray(triggerValue)) {
				shouldTrigger = expectedValues.some(expected =>
					triggerValue.some((val: unknown) => {
						const valStr = String(val)
						// Support wildcard matching
						if (expected?.includes('*')) {
							const regex = new RegExp('^' + expected.replace(/\*/g, '.*') + '$')
							return regex.test(valStr)
						}
						return valStr === expected
					})
				)
			} else {
				const valStr = String(triggerValue ?? '')
				shouldTrigger = expectedValues.some(expected => {
					// Support wildcard matching
					if (expected?.includes('*')) {
						const regex = new RegExp('^' + expected.replace(/\*/g, '.*') + '$')
						return regex.test(valStr)
					}
					return valStr === expected
				})
			}
		}
	}

	// Determine visibility based on action
	if (action === 'show') {
		return shouldTrigger
	} else if (action === 'hide') {
		return !shouldTrigger
	}

	// For other actions (enable, disable, empty, fill), don't affect visibility
	return true
}
