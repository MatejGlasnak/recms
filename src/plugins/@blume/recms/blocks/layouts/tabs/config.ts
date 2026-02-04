import type { BlockFieldConfig } from '../../../core/registries/types'
import { TabsEditor } from './TabsEditor'

export const tabsConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'nesting',
			type: 'group',
			label: 'Nesting Configuration',
			columns: 6,
			fields: [
				{
					name: 'registryType',
					type: 'dropdown',
					label: 'Component Type',
					options: [
						{ label: 'Blocks', value: 'block' },
						{ label: 'Fields', value: 'field' },
						{ label: 'Filters', value: 'filter' }
					],
					default: 'block',
					comment: 'Type of components tabs can contain',
					span: 6
				}
			]
		},
		{
			name: 'general',
			type: 'group',
			label: 'General Settings',
			columns: 6,
			fields: [
				{
					name: 'defaultTab',
					type: 'text',
					label: 'Default Tab ID',
					placeholder: 'Leave empty for first tab',
					comment: 'ID of the tab to show by default',
					span: 3
				},
				{
					name: 'orientation',
					type: 'dropdown',
					label: 'Orientation',
					options: [
						{ label: 'Horizontal', value: 'horizontal' },
						{ label: 'Vertical', value: 'vertical' }
					],
					default: 'horizontal',
					span: 3
				}
			]
		},
		{
			name: 'appearance',
			type: 'group',
			label: 'Appearance',
			columns: 6,
			fields: [
				{
					name: 'variant',
					type: 'dropdown',
					label: 'Variant',
					options: [
						{ label: 'Default', value: 'default' },
						{ label: 'Pills', value: 'pills' },
						{ label: 'Underline', value: 'underline' }
					],
					default: 'default',
					span: 6
				}
			]
		},
		{
			name: 'tabsConfig',
			type: 'group',
			label: 'Tabs Configuration',
			columns: 12,
			fields: [
				{
					name: 'tabs',
					type: 'custom',
					label: 'Tabs',
					span: 12,
					renderer: TabsEditor,
					default: [],
					comment: 'Configure tab labels and order (blocks are managed in the main view)'
				}
			]
		}
	]
}
