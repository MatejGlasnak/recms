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
