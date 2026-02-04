import type { BlockFieldConfig } from '../../../core/registries/types'

export const filterInputConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'label',
			type: 'text',
			label: 'Label',
			placeholder: 'e.g., Search, Name',
			required: true,
			span: 'full'
		},
		{
			name: 'field',
			type: 'text',
			label: 'Field Name',
			placeholder: 'e.g., name, title, email',
			required: true,
			comment: 'The database field to filter on',
			span: 'full'
		},
		{
			name: 'operator',
			type: 'dropdown',
			label: 'Filter Operator',
			placeholder: 'Select operator...',
			default: 'contains',
			comment: 'How to compare the filter value',
			span: 'full',
			options: [
				{ label: 'Equals', value: 'eq' },
				{ label: 'Not Equals', value: 'ne' },
				{ label: 'Contains', value: 'contains' },
				{ label: 'Starts With', value: 'startsWith' },
				{ label: 'Ends With', value: 'endsWith' }
			]
		},
		{
			name: 'placeholder',
			type: 'text',
			label: 'Placeholder',
			placeholder: 'e.g., Search by name...',
			comment: 'Optional placeholder text',
			span: 'full'
		},
		{
			name: 'defaultValue',
			type: 'text',
			label: 'Default Value',
			placeholder: 'e.g., Default search text...',
			comment: 'Optional default value for the filter',
			span: 'full'
		}
	]
}
