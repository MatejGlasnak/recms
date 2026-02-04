import type { BlockFieldConfig } from '../../registry'

export const listPaginationConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'pageSize',
			type: 'number',
			label: 'Default Page Size',
			default: 10,
			comment: 'Number of items to show per page',
			span: 'full'
		},
		{
			name: 'pageSizeOptions',
			type: 'text',
			label: 'Page Size Options (comma-separated)',
			default: '10,25,50,100',
			placeholder: '10,25,50,100',
			comment: 'Available page size options for users to choose from',
			span: 'full'
		}
	]
}
