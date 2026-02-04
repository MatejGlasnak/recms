import type { BlockFieldConfig } from '../../registry'

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
			name: 'placeholder',
			type: 'text',
			label: 'Placeholder',
			placeholder: 'e.g., Select a status...',
			comment: 'Optional placeholder text',
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
