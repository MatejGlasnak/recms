import type { RecmsConfig } from '@blume/recms-core'

/**
 * Default ReCMS configuration
 *
 * Provides sensible defaults for most use cases.
 * You can override any of these values in your app.
 */
export const defaultRecmsConfig: RecmsConfig = {
	// API endpoints
	api: {
		pageConfig: '/api/admin/config/pages',
		resources: '/api/admin/resources'
	},

	// Custom components (empty by default)
	blocks: [],
	columns: [],
	filters: [],
	fields: [],

	// Feature flags
	features: {
		enableEditMode: true,
		enableDragDrop: true,
		enableAutoSave: false
	}
}
