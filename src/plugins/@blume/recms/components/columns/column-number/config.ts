import type { BlockFieldConfig } from '../../registry'

export const columnNumberConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'basic',
			type: 'group',
			label: 'Basic Information',
			columns: 12,
			fields: [
				{
					name: 'label',
					type: 'text',
					label: 'Column Label',
					required: true,
					span: 3
				},
				{
					name: 'field',
					type: 'text',
					label: 'Field Name',
					required: true,
					span: 3
				},
				{
					name: 'format',
					type: 'dropdown',
					label: 'Format',
					options: [
						{ label: 'Default', value: '' },
						{ label: 'Currency', value: 'currency' }
					],
					span: 3
				},
				{
					name: 'width',
					type: 'number',
					label: 'Width (pixels)',
					placeholder: 'Leave empty for auto',
					span: 3
				}
			]
		},
		{
			name: 'settings',
			type: 'group',
			label: 'Display Settings',
			columns: 6,
			fields: [
				{
					name: 'sortable',
					type: 'switch',
					label: 'Sortable',
					default: true,
					span: 3
				},
				{
					name: 'enabledByDefault',
					type: 'switch',
					label: 'Visible by Default',
					default: true,
					span: 3
				}
			]
		}
	]
}
