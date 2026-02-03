export interface FilterConfig {
	id: string
	type: 'input' | 'select' | 'combobox' | 'checkbox'
	label: string
	field: string // The field to filter on
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
		| 'nin' // Filter operator
	placeholder?: string // For input, select, and combobox
	options?: { label: string; value: string }[] // For select and combobox
	defaultValue?: string | boolean | string[]
	multiple?: boolean // For combobox - allow multiple selections
}

export interface ColumnConfig {
	id: string
	field: string // The field from data
	label: string // Display label
	type: 'text' | 'date' | 'number' | 'badge' | 'boolean' | 'json'
	enabledByDefault: boolean // Whether this column should be visible by default
	sortable: boolean // Whether sorting is enabled for this column
	width?: number // Optional width in pixels
	badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline' // For badge type
	format?: string // Optional format string (for dates, numbers, etc.)
}

export interface ListConfig {
	id: string
	resourceId: string
	meta: {
		title?: string
		description?: string
	}
	columns?: ColumnConfig[]
	filters?: FilterConfig[]
}

export interface ListConfigFormData {
	title: string
	description: string
}
