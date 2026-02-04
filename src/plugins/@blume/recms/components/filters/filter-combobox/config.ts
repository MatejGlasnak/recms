import type { BlockFieldConfig } from '../../registry'

export const filterComboboxConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'label',
			type: 'text',
			label: 'Label',
			required: true,
			span: 'full'
		},
		{
			name: 'field',
			type: 'text',
			label: 'Field Name',
			required: true,
			comment: 'The database field to filter on',
			span: 'full'
		},
		{
			name: 'placeholder',
			type: 'text',
			label: 'Placeholder',
			span: 'full'
		},
		{
			name: 'multiple',
			type: 'checkbox',
			label: 'Allow Multiple Selection',
			default: false,
			span: 'full'
		},
		{
			name: 'operator',
			type: 'dropdown',
			label: 'Operator',
			default: 'eq',
			options: [
				{ label: 'Equals', value: 'eq' },
				{ label: 'Not Equals', value: 'ne' },
				{ label: 'In', value: 'in' },
				{ label: 'Not In', value: 'nin' }
			],
			span: 'full'
		}
	]
}
