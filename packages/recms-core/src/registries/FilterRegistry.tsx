'use client'

import React, { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import type { FilterDefinition } from './types'

interface FilterRegistryContextValue {
	filters: Map<string, FilterDefinition>
	registerFilter: (definition: FilterDefinition) => void
	unregisterFilter: (slug: string) => void
	getFilter: (slug: string) => FilterDefinition | undefined
}

const FilterRegistryContext = createContext<FilterRegistryContextValue | null>(null)

export function FilterRegistryProvider({ children }: { children: ReactNode }) {
	const [filters] = React.useState(() => new Map<string, FilterDefinition>())

	const registerFilter = React.useCallback(
		(definition: FilterDefinition) => {
			filters.set(definition.slug, definition)
		},
		[filters]
	)

	const unregisterFilter = React.useCallback(
		(slug: string) => {
			filters.delete(slug)
		},
		[filters]
	)

	const getFilter = React.useCallback(
		(slug: string) => {
			return filters.get(slug)
		},
		[filters]
	)

	// Note: Built-in filters are registered in @blume/recms package
	// This keeps recms-core UI-agnostic
	useEffect(() => {
		// No auto-registration here - moved to @blume/recms
	}, [registerFilter])

	const value = useMemo(
		() => ({
			filters,
			registerFilter,
			unregisterFilter,
			getFilter
		}),
		[filters, registerFilter, unregisterFilter, getFilter]
	)

	return <FilterRegistryContext.Provider value={value}>{children}</FilterRegistryContext.Provider>
}

export function useFilterRegistry() {
	const context = useContext(FilterRegistryContext)
	if (!context) {
		throw new Error('useFilterRegistry must be used within FilterRegistryProvider')
	}
	return context
}

export function useRegisterFilter(definition: FilterDefinition) {
	const { registerFilter, unregisterFilter } = useFilterRegistry()

	React.useEffect(() => {
		registerFilter(definition)
		return () => {
			unregisterFilter(definition.slug)
		}
	}, [definition, registerFilter, unregisterFilter])
}

export function useFilter(slug: string) {
	const { getFilter } = useFilterRegistry()
	return getFilter(slug)
}
