import type { BlockFieldConfig } from '../../registry'
import { ColumnEditor } from './ColumnEditor'

export const listTableConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'general',
			type: 'group',
			label: 'General Settings',
			columns: 12,
			fields: [
				{
					name: 'rowClickAction',
					type: 'dropdown',
					label: 'Row Click Action',
					options: [
						{ label: 'None', value: 'none' },
						{ label: 'Show Details', value: 'show' },
						{ label: 'Edit Record', value: 'edit' }
					],
					default: 'none',
					comment: 'Action to perform when a user clicks on a table row',
					span: 12
				}
			]
		},
		{
			name: 'columns',
			type: 'custom',
			label: 'Columns',
			span: 'full',
			renderer: ColumnEditor,
			default: [],
			comment: 'Configure table columns, their display types, and sorting behavior'
		}
	]
}
