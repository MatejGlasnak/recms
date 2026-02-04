import type { BlockFieldConfig } from '../../../core/registries/types'

export const listHeaderConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'title',
			type: 'text',
			label: 'Title',
			placeholder: 'Enter page title...',
			comment: 'Main heading displayed at the top of the list page',
			span: 'full'
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description',
			placeholder: 'Enter page description...',
			comment: 'Optional description text shown below the title',
			span: 'full'
		}
	]
}
