import type { BlockFieldConfig } from '../../registry'

export const filterComboboxConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'label',
			type: 'text',
			label: 'Label',
			placeholder: 'e.g., Tags, Categories',
			required: true,
			span: 'full'
		},
		{
			name: 'field',
			type: 'text',
			label: 'Field Name',
			placeholder: 'e.g., tags, categories',
			required: true,
			comment: 'The database field to filter on',
			span: 'full'
		},
		{
			name: 'operator',
			type: 'dropdown',
			label: 'Filter Operator',
			placeholder: 'Select operator...',
			default: 'in',
			comment: 'How to compare the filter value',
			span: 'full',
			options: [
				{ label: 'Equals', value: 'eq' },
				{ label: 'Not Equals', value: 'ne' },
				{ label: 'In List', value: 'in' },
				{ label: 'Not In List', value: 'nin' },
				{ label: 'Contains', value: 'contains' }
			]
		},
		{
			name: 'placeholder',
			type: 'text',
			label: 'Placeholder',
			placeholder: 'e.g., Select tags...',
			comment: 'Optional placeholder text',
			span: 'full'
		},
		{
			name: 'multiple',
			type: 'checkbox',
			label: 'Allow Multiple Selections',
			default: false,
			span: 'full'
		},
		{
			name: 'defaultValue',
			type: 'text',
			label: 'Default Value',
			placeholder: 'e.g., tag1,tag2 (comma-separated for multiple)',
			comment: 'Optional default value for the filter',
			span: 'full'
		},
		{
			name: 'options',
			type: 'repeater',
			label: 'Options',
			comment: 'Available options for the combobox',
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
