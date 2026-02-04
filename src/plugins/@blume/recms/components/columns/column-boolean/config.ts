import type { BlockFieldConfig } from '../../registry'

export const columnBooleanConfig: BlockFieldConfig = {
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
					span: 4
				},
				{
					name: 'field',
					type: 'text',
					label: 'Field Name',
					required: true,
					span: 4
				},
				{
					name: 'width',
					type: 'number',
					label: 'Width (pixels)',
					placeholder: 'Leave empty for auto',
					span: 4
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
