import type { BlockFieldConfig } from '../../registry'

// Page-level configuration
export const listPageConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'layout',
			type: 'dropdown',
			label: 'Layout',
			options: [
				{ label: 'Default', value: 'default' },
				{ label: 'Compact', value: 'compact' },
				{ label: 'Full Width', value: 'full' }
			],
			default: 'default',
			span: 'full'
		}
	]
}
