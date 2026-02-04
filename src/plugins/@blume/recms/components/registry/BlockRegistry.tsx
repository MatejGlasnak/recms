'use client'

import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { BlockConfig } from '../../types'

export interface BlockDefinition {
	slug: string
	Component: React.ComponentType<BlockComponentProps>
	config: BlockFieldConfig
	label?: string
	description?: string
}

export interface BlockComponentProps {
	blockConfig: BlockConfig
	data?: unknown[]
	isLoading?: boolean
	editMode?: boolean
	resourceId?: string
	onConfigUpdate?: (blockId: string, config: Record<string, unknown>) => Promise<void>
	onDelete?: () => Promise<void> | void
	// Context-specific props that blocks might need
	[key: string]: unknown
}

export interface BlockFieldConfig {
	fields: FieldDefinition[]
	tabs?: TabDefinition[]
}

export interface FieldDefinition {
	name: string
	type: string
	label?: string
	span?: 'auto' | 'left' | 'right' | 'row' | 'full'
	tab?: string
	default?: unknown
	placeholder?: string
	comment?: string
	commentAbove?: string
	defaultFrom?: string
	cssClass?: string
	autoFocus?: boolean
	readOnly?: boolean
	disabled?: boolean
	hidden?: boolean
	stretch?: boolean
	context?: string
	dependsOn?: string[]
	changeHandler?: string
	trigger?: TriggerConfig
	preset?: PresetConfig
	required?: boolean
	attributes?: Record<string, unknown>
	containerAttributes?: Record<string, unknown>
	order?: number
	permissions?: string | string[]
	// Field-type specific options
	options?: { label: string; value: string }[]
	multiple?: boolean
	size?: 'tiny' | 'small' | 'large' | 'huge' | 'giant'
	// For repeater fields
	form?: BlockFieldConfig
	minItems?: number
	maxItems?: number
	// For number/slider fields
	min?: number
	max?: number
	step?: number
	// Custom renderer for complex fields
	renderer?: React.ComponentType<{
		value: unknown
		onChange: (value: unknown) => void
		field: FieldDefinition
	}>
}

export interface TriggerConfig {
	action: 'show' | 'hide' | 'enable' | 'disable' | 'empty' | string // 'fill[value]'
	field: string
	condition: 'checked' | 'unchecked' | string // 'value[somevalue]'
}

export interface PresetConfig {
	field: string
	type?: 'slug' | 'url' | 'camel' | 'file' | 'exact'
	prefixInput?: string
}

export interface TabDefinition {
	name: string
	label: string
	stretch?: boolean
	lazy?: boolean
	icon?: string
	cssClass?: string
}

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
