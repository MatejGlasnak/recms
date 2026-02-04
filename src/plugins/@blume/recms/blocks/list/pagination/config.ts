import type { BlockFieldConfig } from '../../../core/registries/types'

export const listPaginationConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'pageSize',
			type: 'number',
			label: 'Default Page Size',
			default: 10,
			comment: 'Number of items to show per page by default',
			span: 'full',
			min: 1,
			max: 1000
		},
		{
			name: 'pageSizeOptions',
			type: 'text',
			label: 'Page Size Options',
			default: '10,25,50,100',
			placeholder: '10,25,50,100',
			comment: 'Comma-separated list of page size options available to users',
			span: 'full'
		}
	]
}
