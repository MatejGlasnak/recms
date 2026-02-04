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

	// Auto-register built-in columns
	useEffect(() => {
		// Import and register all built-in column types
		import('../../columns').then(module => {
			// column-text
			if (module.ColumnText && module.columnTextConfig) {
				registerColumn({
					slug: 'column-text',
					Component: module.ColumnText,
					config: module.columnTextConfig,
					label: 'Text Column',
					description: 'Display text values'
				})
			}

			// column-number
			if (module.ColumnNumber && module.columnNumberConfig) {
				registerColumn({
					slug: 'column-number',
					Component: module.ColumnNumber,
					config: module.columnNumberConfig,
					label: 'Number Column',
					description: 'Display numeric values'
				})
			}

			// column-date
			if (module.ColumnDate && module.columnDateConfig) {
				registerColumn({
					slug: 'column-date',
					Component: module.ColumnDate,
					config: module.columnDateConfig,
					label: 'Date Column',
					description: 'Display date values'
				})
			}

			// column-boolean
			if (module.ColumnBoolean && module.columnBooleanConfig) {
				registerColumn({
					slug: 'column-boolean',
					Component: module.ColumnBoolean,
					config: module.columnBooleanConfig,
					label: 'Boolean Column',
					description: 'Display boolean values'
				})
			}

			// column-badge
			if (module.ColumnBadge && module.columnBadgeConfig) {
				registerColumn({
					slug: 'column-badge',
					Component: module.ColumnBadge,
					config: module.columnBadgeConfig,
					label: 'Badge Column',
					description: 'Display values as badges'
				})
			}

			// column-json
			if (module.ColumnJson && module.columnJsonConfig) {
				registerColumn({
					slug: 'column-json',
					Component: module.ColumnJson,
					config: module.columnJsonConfig,
					label: 'JSON Column',
					description: 'Display JSON values'
				})
			}
		})
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
