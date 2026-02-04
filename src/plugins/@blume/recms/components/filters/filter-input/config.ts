import type { BlockFieldConfig } from '../../registry'

export const filterInputConfig: BlockFieldConfig = {
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
			name: 'operator',
			type: 'dropdown',
			label: 'Operator',
			default: 'contains',
			options: [
				{ label: 'Equals', value: 'eq' },
				{ label: 'Not Equals', value: 'ne' },
				{ label: 'Contains', value: 'contains' },
				{ label: 'Starts With', value: 'startsWith' },
				{ label: 'Ends With', value: 'endsWith' }
			],
			span: 'full'
		}
	]
}
