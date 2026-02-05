import type { BlockFieldConfig } from '@blume/recms-core'

export const columnBadgeConfig: BlockFieldConfig = {
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
					name: 'badgeVariant',
					type: 'dropdown',
					label: 'Badge Variant',
					options: [
						{ label: 'Default', value: 'default' },
						{ label: 'Secondary', value: 'secondary' },
						{ label: 'Destructive', value: 'destructive' },
						{ label: 'Outline', value: 'outline' }
					],
					default: 'default',
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
					comment: 'Allow users to sort table data by this column',
					span: 3
				},
				{
					name: 'enabledByDefault',
					type: 'switch',
					label: 'Visible by Default',
					default: true,
					comment: 'Show this column when the table first loads',
					span: 3
				}
			]
		}
	]
}
