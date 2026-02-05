'use client'

import React, { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import type { ColumnDefinition } from './types'

interface ColumnRegistryContextValue {
	columns: Map<string, ColumnDefinition>
	registerColumn: (definition: ColumnDefinition) => void
	unregisterColumn: (slug: string) => void
	getColumn: (slug: string) => ColumnDefinition | undefined
}

const ColumnRegistryContext = createContext<ColumnRegistryContextValue | null>(null)

export function ColumnRegistryProvider({ children }: { children: ReactNode }) {
	const [columns] = React.useState(() => new Map<string, ColumnDefinition>())

	const registerColumn = React.useCallback(
		(definition: ColumnDefinition) => {
			columns.set(definition.slug, definition)
		},
		[columns]
	)

	const unregisterColumn = React.useCallback(
		(slug: string) => {
			columns.delete(slug)
		},
		[columns]
	)

	const getColumn = React.useCallback(
		(slug: string) => {
			return columns.get(slug)
		},
		[columns]
	)

	// Note: Built-in columns are registered in @blume/recms package
	// This keeps recms-core UI-agnostic
	useEffect(() => {
		// No auto-registration here - moved to @blume/recms
	}, [registerColumn])

	const value = useMemo(
		() => ({
			columns,
			registerColumn,
			unregisterColumn,
			getColumn
		}),
		[columns, registerColumn, unregisterColumn, getColumn]
	)

	return <ColumnRegistryContext.Provider value={value}>{children}</ColumnRegistryContext.Provider>
}

export function useColumnRegistry() {
	const context = useContext(ColumnRegistryContext)
	if (!context) {
		throw new Error('useColumnRegistry must be used within ColumnRegistryProvider')
	}
	return context
}

export function useRegisterColumn(definition: ColumnDefinition) {
	const { registerColumn, unregisterColumn } = useColumnRegistry()

	React.useEffect(() => {
		registerColumn(definition)
		return () => {
			unregisterColumn(definition.slug)
		}
	}, [definition, registerColumn, unregisterColumn])
}

export function useColumn(slug: string) {
	const { getColumn } = useColumnRegistry()
	return getColumn(slug)
}
