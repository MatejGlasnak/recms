// Block-based page configuration types

export interface BlockConfig {
	id: string // Unique instance ID
	slug: string // Block type (e.g., 'list-header', 'list-filters')
	labels?: Record<string, string> // i18n labels
	config: Record<string, unknown> // Block-specific configuration
	visible?: boolean // Show/hide block
	order?: number // Display order
}

export interface PageConfig {
	id: string | null
	resourceId: string
	blocks: BlockConfig[]
}

// Legacy list config for backward compatibility during migration
export interface LegacyListConfig {
	id: string | null
	resourceId: string
	meta?: {
		title?: string
		description?: string
	}
	columns?: ColumnConfig[]
	filters?: FilterConfig[]
	rowClickAction?: 'show' | 'edit' | 'none'
}

export interface ColumnConfig {
	id: string
	field: string
	label: string
	type: 'text' | 'date' | 'number' | 'badge' | 'boolean' | 'json'
	enabledByDefault: boolean
	sortable: boolean
	width?: number
	badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
	format?: string
}

export interface FilterConfig {
	id: string
	type: 'input' | 'select' | 'combobox' | 'checkbox'
	label: string
	field: string
	operator?:
		| 'eq'
		| 'ne'
		| 'contains'
		| 'startsWith'
		| 'endsWith'
		| 'gt'
		| 'gte'
		| 'lt'
		| 'lte'
		| 'in'
		| 'nin'
	placeholder?: string
	options?: { label: string; value: string }[]
	defaultValue?: string | boolean | string[]
	multiple?: boolean
}
