import type {
	BlockDefinition,
	ColumnDefinition,
	FilterDefinition,
	FieldTypeDefinition
} from '../registries/types'

export interface RecmsConfig {
	// API endpoints
	api?: {
		pageConfig?: string // Default: '/api/admin/config/pages'
		resources?: string // Default: '/api/admin/resources'
	}

	// Custom component registration
	blocks?: BlockDefinition[]
	columns?: ColumnDefinition[]
	filters?: FilterDefinition[]
	fields?: FieldTypeDefinition[]

	// Feature flags
	features?: {
		enableEditMode?: boolean // Default: true
		enableDragDrop?: boolean // Default: true
		enableAutoSave?: boolean // Default: false
	}
}
