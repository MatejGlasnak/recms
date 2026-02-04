import type { BlockFieldConfig } from '../../../core/registries/types'

export const filterSelectConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'label',
			type: 'text',
			label: 'Label',
			placeholder: 'e.g., Status, Category',
			required: true,
			span: 'full'
		},
		{
			name: 'field',
			type: 'text',
			label: 'Field Name',
			placeholder: 'e.g., status, category',
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
				{ label: 'Not Equals', value: 'ne' },
				{ label: 'In List', value: 'in' },
				{ label: 'Not In List', value: 'nin' }
			]
		},
		{
			name: 'placeholder',
			type: 'text',
			label: 'Placeholder',
			placeholder: 'e.g., Select a status...',
			comment: 'Optional placeholder text',
			span: 'full'
		},
		{
			name: 'defaultValue',
			type: 'text',
			label: 'Default Value',
			placeholder: 'e.g., active',
			comment: 'Optional default value for the filter',
			span: 'full'
		},
		{
			name: 'options',
			type: 'repeater',
			label: 'Options',
			comment: 'Available options for the select',
			span: 'full',
			default: [],
			form: {
				fields: [
					{
						name: 'label',
						type: 'text',
						label: 'Label',
						placeholder: 'Display text',
						required: true,
						span: 'left'
					},
					{
						name: 'value',
						type: 'text',
						label: 'Value',
						placeholder: 'Actual value',
						required: true,
						span: 'right'
					}
				]
			}
		}
	]
}
