import type { BlockFieldConfig } from '../../registry'
import { ColumnEditor } from './ColumnEditor'

export const listTableConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'columns',
			type: 'custom',
			label: 'Columns',
			span: 'full',
			renderer: ColumnEditor,
			default: []
		},
		{
			name: 'rowClickAction',
			type: 'dropdown',
			label: 'Row Click Action',
			options: [
				{ label: 'None', value: 'none' },
				{ label: 'Show', value: 'show' },
				{ label: 'Edit', value: 'edit' }
			],
			default: 'none',
			span: 'full'
		}
	]
}
