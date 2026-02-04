'use client'

import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { FieldDefinition } from './BlockRegistry'

export interface FieldComponentProps {
	field: FieldDefinition
	value: unknown
	onChange: (value: unknown) => void
	error?: string
	disabled?: boolean
	readOnly?: boolean
}

export interface FieldTypeDefinition {
	type: string
	Component: React.ComponentType<FieldComponentProps>
	label?: string
	description?: string
}

interface FieldRegistryContextValue {
	fields: Map<string, FieldTypeDefinition>
	registerField: (definition: FieldTypeDefinition) => void
	unregisterField: (type: string) => void
	getField: (type: string) => FieldTypeDefinition | undefined
}

const FieldRegistryContext = createContext<FieldRegistryContextValue | null>(null)

export function FieldRegistryProvider({ children }: { children: ReactNode }) {
	const [fields] = React.useState(() => new Map<string, FieldTypeDefinition>())

	const registerField = React.useCallback(
		(definition: FieldTypeDefinition) => {
			fields.set(definition.type, definition)
		},
		[fields]
	)

	const unregisterField = React.useCallback(
		(type: string) => {
			fields.delete(type)
		},
		[fields]
	)

	const getField = React.useCallback(
		(type: string) => {
			return fields.get(type)
		},
		[fields]
	)

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
