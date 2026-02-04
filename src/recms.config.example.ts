/**
 * ReCMS Configuration Example
 *
 * This file demonstrates how to configure and extend ReCMS with custom components.
 * Copy this file to `recms.config.ts` in your project root to use it.
 *
 * All fields are optional - ReCMS works with zero configuration by default.
 */

import type { RecmsConfig } from '@blume/recms'

// Example: Import custom components
// import { MyCustomBlock, myCustomBlockConfig } from './src/components/blocks/MyCustomBlock'
// import { StatusColumn, statusColumnConfig } from './src/components/columns/StatusColumn'

export default {
	// ============================================
	// API ENDPOINTS
	// ============================================
	// Configure custom API endpoints
	// Default values are shown below
	api: {
		pageConfig: '/api/admin/config/pages', // Page configuration endpoint
		resources: '/api/admin/resources' // Resources metadata endpoint
	},

	// ============================================
	// CUSTOM BLOCKS
	// ============================================
	// Register custom page-level blocks
	// Example:
	// blocks: [
	//   {
	//     slug: 'analytics-widget',
	//     Component: MyCustomBlock,
	//     config: myCustomBlockConfig,
	//     label: 'Analytics Widget',
	//     description: 'Display analytics dashboard'
	//   }
	// ],
	blocks: [],

	// ============================================
	// CUSTOM COLUMNS
	// ============================================
	// Register custom table column types
	// Example:
	// columns: [
	//   {
	//     slug: 'status-indicator',
	//     Component: StatusColumn,
	//     config: statusColumnConfig,
	//     label: 'Status Indicator',
	//     description: 'Visual status with colors'
	//   }
	// ],
	columns: [],

	// ============================================
	// CUSTOM FILTERS
	// ============================================
	// Register custom filter types
	// Example:
	// filters: [
	//   {
	//     slug: 'date-range',
	//     Component: DateRangeFilter,
	//     config: dateRangeFilterConfig,
	//     label: 'Date Range Filter'
	//   }
	// ],
	filters: [],

	// ============================================
	// CUSTOM FIELDS
	// ============================================
	// Register custom form field types
	// Example:
	// fields: [
	//   {
	//     type: 'rich-editor',
	//     Component: RichEditorField,
	//     label: 'Rich Text Editor'
	//   }
	// ],
	fields: [],

	// ============================================
	// FEATURE FLAGS
	// ============================================
	// Enable/disable specific features
	features: {
		enableEditMode: true, // Allow page configuration editing
		enableDragDrop: true, // Allow drag & drop reordering
		enableAutoSave: false // Auto-save config changes
	}
} satisfies RecmsConfig
