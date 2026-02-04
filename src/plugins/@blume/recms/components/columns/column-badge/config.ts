import type { BlockFieldConfig } from '../../registry'

export const columnBadgeConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'label',
			type: 'text',
			label: 'Column Label',
			required: true,
			span: 'full'
		},
		{
			name: 'field',
			type: 'text',
			label: 'Field Name',
			required: true,
			comment: 'The database field to display',
			span: 'full'
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
			span: 'full'
		},
		{
			name: 'sortable',
			type: 'checkbox',
			label: 'Sortable',
			default: true,
			span: 'full'
		},
		{
			name: 'enabledByDefault',
			type: 'checkbox',
			label: 'Visible by Default',
			default: true,
			span: 'full'
		},
		{
			name: 'width',
			type: 'number',
			label: 'Width (pixels)',
			placeholder: 'Leave empty for auto',
			span: 'full'
		}
	]
}
