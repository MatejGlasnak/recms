import type { BlockFieldConfig } from '../../registry'

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
		}
	]
}
