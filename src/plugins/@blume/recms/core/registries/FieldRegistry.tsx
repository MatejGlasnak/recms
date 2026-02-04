'use client'

import React, { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import type { FieldTypeDefinition } from './types'

interface FieldRegistryContextValue {
	fields: Map<string, FieldTypeDefinition>
	registerField: (definition: FieldTypeDefinition) => void
	unregisterField: (type: string) => void
	getField: (type: string) => FieldTypeDefinition | undefined
}

const FieldRegistryContext = createContext<FieldRegistryContextValue | null>(null)

export function FieldRegistryProvider({ children }: { children: ReactNode }) {
	const [fields, setFields] = React.useState(() => new Map<string, FieldTypeDefinition>())

	const registerField = React.useCallback((definition: FieldTypeDefinition) => {
		setFields(prev => {
			const next = new Map(prev)
			next.set(definition.type, definition)
			return next
		})
	}, [])

	const unregisterField = React.useCallback((type: string) => {
		setFields(prev => {
			const next = new Map(prev)
			next.delete(type)
			return next
		})
	}, [])

	const getField = React.useCallback(
		(type: string) => {
			return fields.get(type)
		},
		[fields]
	)

	// Auto-register all field types on mount
	useEffect(() => {
		// Import registerAllFields helper
		import('../../fields/registerFields').then(module => {
			if (module.registerAllFields) {
				module.registerAllFields(registerField)
			}
		})
	}, [registerField])

	const value = useMemo(
		() => ({
			fields,
			registerField,
			unregisterField,
			getField
		}),
		[fields, registerField, unregisterField, getField]
	)

	return <FieldRegistryContext.Provider value={value}>{children}</FieldRegistryContext.Provider>
}

export function useFieldRegistry() {
	const context = useContext(FieldRegistryContext)
	if (!context) {
		throw new Error('useFieldRegistry must be used within FieldRegistryProvider')
	}
	return context
}

export function useRegisterField(definition: FieldTypeDefinition) {
	const { registerField, unregisterField } = useFieldRegistry()

	React.useEffect(() => {
		registerField(definition)
		return () => {
			unregisterField(definition.type)
		}
	}, [definition, registerField, unregisterField])
}

export function useField(type: string) {
	const { getField } = useFieldRegistry()
	return getField(type)
}
