import type { BlockFieldConfig } from '../../registry'

export const listHeaderConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'title',
			type: 'text',
			label: 'Title',
			placeholder: 'Enter page title',
			span: 'full'
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description',
			placeholder: 'Enter page description',
			span: 'full'
		},
		{
			name: 'showEditButton',
			type: 'checkbox',
			label: 'Show Edit Button',
			default: true,
			comment: 'Display the edit mode toggle button',
			span: 'full'
		}
	]
}
