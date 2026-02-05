import type { RecmsConfig } from './types'

export const defaultConfig: RecmsConfig = {
	api: {
		pageConfig: '/api/admin/config/pages',
		resources: '/api/admin/resources'
	},
	blocks: [],
	columns: [],
	filters: [],
	fields: [],
	features: {
		enableEditMode: true,
		enableDragDrop: true,
		enableAutoSave: false
	}
}
