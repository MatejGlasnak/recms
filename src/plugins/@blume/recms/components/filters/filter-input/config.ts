import type { BlockFieldConfig } from '../../registry'

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
			name: 'placeholder',
			type: 'text',
			label: 'Placeholder',
			placeholder: 'e.g., Search by name...',
			comment: 'Optional placeholder text',
			span: 'full'
		}
	]
}
