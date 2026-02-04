import type { BlockFieldConfig } from '../../registry'

export const listFiltersConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'title',
			type: 'text',
			label: 'Title',
			placeholder: 'Filter title...',
			span: 'full'
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description',
			placeholder: 'Filter description...',
			span: 'full'
		}
	]
}
