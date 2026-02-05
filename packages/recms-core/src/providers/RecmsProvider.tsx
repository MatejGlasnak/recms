'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { BlockRegistryProvider, useBlockRegistry } from '../registries/BlockRegistry'
import { ColumnRegistryProvider, useColumnRegistry } from '../registries/ColumnRegistry'
import { FilterRegistryProvider, useFilterRegistry } from '../registries/FilterRegistry'
import { FieldRegistryProvider, useFieldRegistry } from '../registries/FieldRegistry'
import { RecmsConfigProvider, useRecmsConfig } from '../config/context'
import type { RecmsConfig } from '../config/types'
import type { BlockDefinition, ColumnDefinition, FilterDefinition, FieldTypeDefinition } from '../registries/types'

export interface RecmsProviderProps {
	children: ReactNode
	config?: Partial<RecmsConfig>
	/** Built-in blocks to register (passed from @blume/recms package) */
	builtInBlocks?: BlockDefinition[]
	/** Built-in columns to register (passed from @blume/recms package) */
	builtInColumns?: ColumnDefinition[]
	/** Built-in filters to register (passed from @blume/recms package) */
	builtInFilters?: FilterDefinition[]
	/** Built-in fields to register (passed from @blume/recms package) */
	builtInFields?: FieldTypeDefinition[]
}

/**
 * Inner component that registers built-in and custom components
 * Must be inside registry providers to access hooks
 */
function ComponentsRegistrar({
	builtInBlocks,
	builtInColumns,
	builtInFilters,
	builtInFields
}: {
	builtInBlocks?: BlockDefinition[]
	builtInColumns?: ColumnDefinition[]
	builtInFilters?: FilterDefinition[]
	builtInFields?: FieldTypeDefinition[]
}) {
	const config = useRecmsConfig()
	const { registerBlock } = useBlockRegistry()
	const { registerColumn } = useColumnRegistry()
	const { registerFilter } = useFilterRegistry()
	const { registerField } = useFieldRegistry()

	// Register built-in blocks first
	useEffect(() => {
		if (builtInBlocks) {
			builtInBlocks.forEach(block => {
				registerBlock(block)
			})
		}
	}, [builtInBlocks, registerBlock])

	// Register built-in columns
	useEffect(() => {
		if (builtInColumns) {
			builtInColumns.forEach(column => {
				registerColumn(column)
			})
		}
	}, [builtInColumns, registerColumn])

	// Register built-in filters
	useEffect(() => {
		if (builtInFilters) {
			builtInFilters.forEach(filter => {
				registerFilter(filter)
			})
		}
	}, [builtInFilters, registerFilter])

	// Register built-in fields
	useEffect(() => {
		if (builtInFields) {
			builtInFields.forEach(field => {
				registerField(field)
			})
		}
	}, [builtInFields, registerField])

	// Register custom blocks from config (these can override built-ins)
	useEffect(() => {
		if (config.blocks) {
			config.blocks.forEach(block => {
				registerBlock(block)
			})
		}
	}, [config.blocks, registerBlock])

	// Register custom columns from config
	useEffect(() => {
		if (config.columns) {
			config.columns.forEach(column => {
				registerColumn(column)
			})
		}
	}, [config.columns, registerColumn])

	// Register custom filters from config
	useEffect(() => {
		if (config.filters) {
			config.filters.forEach(filter => {
				registerFilter(filter)
			})
		}
	}, [config.filters, registerFilter])

	// Register custom fields from config
	useEffect(() => {
		if (config.fields) {
			config.fields.forEach(field => {
				registerField(field)
			})
		}
	}, [config.fields, registerField])

	return null
}

/**
 * Main ReCMS Provider
 * Wraps all registries and config context
 * Auto-registers built-in and custom components
 */
export function RecmsProvider({ 
	children, 
	config,
	builtInBlocks,
	builtInColumns,
	builtInFilters,
	builtInFields
}: RecmsProviderProps) {
	return (
		<RecmsConfigProvider config={config}>
			<BlockRegistryProvider>
				<ColumnRegistryProvider>
					<FilterRegistryProvider>
						<FieldRegistryProvider>
							<ComponentsRegistrar 
								builtInBlocks={builtInBlocks}
								builtInColumns={builtInColumns}
								builtInFilters={builtInFilters}
								builtInFields={builtInFields}
							/>
							{children}
						</FieldRegistryProvider>
					</FilterRegistryProvider>
				</ColumnRegistryProvider>
			</BlockRegistryProvider>
		</RecmsConfigProvider>
	)
}
