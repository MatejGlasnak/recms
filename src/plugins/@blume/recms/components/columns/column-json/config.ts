import type { BlockFieldConfig } from '../../registry'

export const columnJsonConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'label',
			type: 'text',
			label: 'Column Label',
			required: true,
			span: 'full'
		},
		{
			name: 'field',
			type: 'text',
			label: 'Field Name',
			required: true,
			comment: 'The database field to display',
			span: 'full'
		},
		{
			name: 'sortable',
			type: 'checkbox',
			label: 'Sortable',
			default: false,
			span: 'full'
		},
		{
			name: 'enabledByDefault',
			type: 'checkbox',
			label: 'Visible by Default',
			default: true,
			span: 'full'
		},
		{
			name: 'width',
			type: 'number',
			label: 'Width (pixels)',
			placeholder: 'Leave empty for auto',
			span: 'full'
		}
	]
}
