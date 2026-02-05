import type { BlockConfig } from '../types/block-config'
import type React from 'react'

// Registry type identifier
export type RegistryType = 'block' | 'column' | 'field' | 'filter'

// Shared field config interface (from BlockRegistry)
export interface BlockFieldConfig {
	fields: FieldDefinition[]
	tabs?: TabDefinition[]
}

export interface FieldDefinition {
	name: string
	type: string
	label?: string
	span?: 'auto' | 'left' | 'right' | 'row' | 'full' | number
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
	// For group fields
	columns?: number
	fields?: FieldDefinition[]
	// Custom renderer for complex fields
	renderer?: React.ComponentType<{
		value: unknown
		onChange: (value: unknown) => void
		field: FieldDefinition
		allValues?: Record<string, unknown>
	}>
}

export interface TriggerConfig {
	action: 'show' | 'hide' | 'enable' | 'disable' | 'empty' | string
	field: string
	condition: 'checked' | 'unchecked' | string
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

// Block Registry Types
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
	[key: string]: unknown
}

// Column Registry Types
export interface ColumnDefinition {
	slug: string
	Component: React.ComponentType<ColumnComponentProps>
	config: BlockFieldConfig
	label?: string
	description?: string
}

export interface ColumnComponentProps {
	value: unknown
	record: Record<string, unknown>
	field: string
	config?: Record<string, unknown>
}

// Filter Registry Types
export interface FilterDefinition {
	slug: string
	Component: React.ComponentType<FilterComponentProps>
	config: BlockFieldConfig
	label?: string
	description?: string
}

export interface FilterComponentProps {
	blockConfig: BlockConfig
	filterValue?: unknown
	onFilterChange?: (value: unknown) => void
	editMode?: boolean
	field?: string
}

// Field Registry Types
export interface FieldTypeDefinition {
	type: string
	Component: React.ComponentType<FieldComponentProps>
	label?: string
	description?: string
}

export interface FieldComponentProps {
	field: FieldDefinition
	value: unknown
	onChange: (value: unknown) => void
	error?: string
	disabled?: boolean
	readOnly?: boolean
}
