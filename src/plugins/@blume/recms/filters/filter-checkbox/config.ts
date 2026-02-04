import type { BlockFieldConfig } from '../../../core/registries/types'

export const filterCheckboxConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'label',
			type: 'text',
			label: 'Label',
			placeholder: 'e.g., Is Active, Show Only Published',
			required: true,
			span: 'full'
		},
		{
			name: 'field',
			type: 'text',
			label: 'Field Name',
			placeholder: 'e.g., isActive, published',
			required: true,
			comment: 'The database field to filter on',
			span: 'full'
		},
		{
			name: 'operator',
			type: 'dropdown',
			label: 'Filter Operator',
			placeholder: 'Select operator...',
			default: 'eq',
			comment: 'How to compare the filter value',
			span: 'full',
			options: [
				{ label: 'Equals', value: 'eq' },
				{ label: 'Not Equals', value: 'ne' }
			]
		},
		{
			name: 'defaultValue',
			type: 'checkbox',
			label: 'Default Value',
			default: false,
			comment: 'Optional default value for the filter',
			span: 'full'
		}
	]
}
