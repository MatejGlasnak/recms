import type { BlockFieldConfig } from '../../registry'

export const columnDateConfig: BlockFieldConfig = {
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
			name: 'format',
			type: 'dropdown',
			label: 'Format',
			options: [
				{ label: 'Date Only (24.12.2026)', value: 'date' },
				{ label: 'Date & Time (24.12.2026 16:30)', value: 'datetime' }
			],
			default: 'date',
			comment: 'Slovak date format is used by default',
			span: 'full'
		},
		{
			name: 'sortable',
			type: 'checkbox',
			label: 'Sortable',
			default: true,
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
