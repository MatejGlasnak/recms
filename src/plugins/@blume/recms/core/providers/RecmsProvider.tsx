'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { BlockRegistryProvider, useBlockRegistry } from '../registries/BlockRegistry'
import { ColumnRegistryProvider, useColumnRegistry } from '../registries/ColumnRegistry'
import { FilterRegistryProvider, useFilterRegistry } from '../registries/FilterRegistry'
import { FieldRegistryProvider, useFieldRegistry } from '../registries/FieldRegistry'
import { RecmsConfigProvider, useRecmsConfig } from '../config/context'
import type { RecmsConfig } from '../config/types'

export interface RecmsProviderProps {
	children: ReactNode
	config?: Partial<RecmsConfig>
}

/**
 * Inner component that registers custom components from config
 * Must be inside registry providers to access hooks
 */
function CustomComponentsRegistrar() {
	const config = useRecmsConfig()
	const { registerBlock } = useBlockRegistry()
	const { registerColumn } = useColumnRegistry()
	const { registerFilter } = useFilterRegistry()
	const { registerField } = useFieldRegistry()

	// Register custom blocks from config
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
export function RecmsProvider({ children, config }: RecmsProviderProps) {
	return (
		<RecmsConfigProvider config={config}>
			<BlockRegistryProvider>
				<ColumnRegistryProvider>
					<FilterRegistryProvider>
						<FieldRegistryProvider>
							<CustomComponentsRegistrar />
							{children}
						</FieldRegistryProvider>
					</FilterRegistryProvider>
				</ColumnRegistryProvider>
			</BlockRegistryProvider>
		</RecmsConfigProvider>
	)
}
