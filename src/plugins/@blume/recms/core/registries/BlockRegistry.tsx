'use client'

import React, { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import type { BlockDefinition } from './types'

interface BlockRegistryContextValue {
	blocks: Map<string, BlockDefinition>
	registerBlock: (definition: BlockDefinition) => void
	unregisterBlock: (slug: string) => void
	getBlock: (slug: string) => BlockDefinition | undefined
}

const BlockRegistryContext = createContext<BlockRegistryContextValue | null>(null)

export function BlockRegistryProvider({ children }: { children: ReactNode }) {
	const [blocks] = React.useState(() => new Map<string, BlockDefinition>())

	const registerBlock = React.useCallback(
		(definition: BlockDefinition) => {
			blocks.set(definition.slug, definition)
		},
		[blocks]
	)

	const unregisterBlock = React.useCallback(
		(slug: string) => {
			blocks.delete(slug)
		},
		[blocks]
	)

	const getBlock = React.useCallback(
		(slug: string) => {
			return blocks.get(slug)
		},
		[blocks]
	)

	// Auto-register built-in blocks
	useEffect(() => {
		// Import and register all built-in block types
		import('../../blocks').then(module => {
			// List blocks
			if (module.ListHeader && module.listHeaderConfig) {
				registerBlock({
					slug: 'list-header',
					Component: module.ListHeader,
					config: module.listHeaderConfig,
					label: 'List Header',
					description: 'Header for list pages'
				})
			}

			if (module.ListFilters && module.listFiltersConfig) {
				registerBlock({
					slug: 'list-filters',
					Component: module.ListFilters,
					config: module.listFiltersConfig,
					label: 'List Filters',
					description: 'Filters for list pages'
				})
			}

			if (module.ListTable && module.listTableConfig) {
				registerBlock({
					slug: 'list-table',
					Component: module.ListTable,
					config: module.listTableConfig,
					label: 'List Table',
					description: 'Data table for list pages'
				})
			}

			if (module.ListPagination && module.listPaginationConfig) {
				registerBlock({
					slug: 'list-pagination',
					Component: module.ListPagination,
					config: module.listPaginationConfig,
					label: 'List Pagination',
					description: 'Pagination for list pages'
				})
			}

			// Show blocks
			if (module.ShowHeader && module.showHeaderConfig) {
				registerBlock({
					slug: 'show-header',
					Component: module.ShowHeader,
					config: module.showHeaderConfig,
					label: 'Show Header',
					description: 'Header for show pages'
				})
			}

			if (module.ShowContent && module.showContentConfig) {
				registerBlock({
					slug: 'show-content',
					Component: module.ShowContent,
					config: module.showContentConfig,
					label: 'Show Content',
					description: 'Content display for show pages'
				})
			}

			// Layout blocks
			if (module.Grid && module.gridConfig) {
				registerBlock({
					slug: 'grid',
					Component: module.Grid,
					config: module.gridConfig,
					label: 'Grid',
					description: 'Flexible grid layout'
				})
			}

			if (module.Tabs && module.tabsConfig) {
				registerBlock({
					slug: 'tabs',
					Component: module.Tabs,
					config: module.tabsConfig,
					label: 'Tabs',
					description: 'Tabbed layout'
				})
			}
		})

		// Import and register filter components as blocks so they can be used in Grid
		import('../../filters').then(module => {
			// filter-input
			if (module.FilterInput && module.filterInputConfig) {
				registerBlock({
					slug: 'filter-input',
					Component: module.FilterInput,
					config: module.filterInputConfig,
					label: 'Text Input Filter',
					description: 'Filter by text input'
				})
			}

			// filter-select
			if (module.FilterSelect && module.filterSelectConfig) {
				registerBlock({
					slug: 'filter-select',
					Component: module.FilterSelect,
					config: module.filterSelectConfig,
					label: 'Select Filter',
					description: 'Filter by dropdown selection'
				})
			}

			// filter-combobox
			if (module.FilterCombobox && module.filterComboboxConfig) {
				registerBlock({
					slug: 'filter-combobox',
					Component: module.FilterCombobox,
					config: module.filterComboboxConfig,
					label: 'Combobox Filter',
					description: 'Filter by searchable combobox'
				})
			}

			// filter-checkbox
			if (module.FilterCheckbox && module.filterCheckboxConfig) {
				registerBlock({
					slug: 'filter-checkbox',
					Component: module.FilterCheckbox,
					config: module.filterCheckboxConfig,
					label: 'Checkbox Filter',
					description: 'Filter by checkbox'
				})
			}
		})
	}, [registerBlock])

	const value = useMemo(
		() => ({
			blocks,
			registerBlock,
			unregisterBlock,
			getBlock
		}),
		[blocks, registerBlock, unregisterBlock, getBlock]
	)

	return <BlockRegistryContext.Provider value={value}>{children}</BlockRegistryContext.Provider>
}

export function useBlockRegistry() {
	const context = useContext(BlockRegistryContext)
	if (!context) {
		throw new Error('useBlockRegistry must be used within BlockRegistryProvider')
	}
	return context
}

export function useRegisterBlock(definition: BlockDefinition) {
	const { registerBlock, unregisterBlock } = useBlockRegistry()

	React.useEffect(() => {
		registerBlock(definition)
		return () => {
			unregisterBlock(definition.slug)
		}
	}, [definition, registerBlock, unregisterBlock])
}

export function useBlock(slug: string) {
	const { getBlock } = useBlockRegistry()
	return getBlock(slug)
}
