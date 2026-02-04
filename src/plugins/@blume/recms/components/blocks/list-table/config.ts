import type { BlockFieldConfig } from '../../registry'
import { ColumnEditor } from './ColumnEditor'

export const listTableConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'header',
			type: 'group',
			label: 'Header Settings',
			columns: 6,
			fields: [
				{
					name: 'allowCreate',
					type: 'switch',
					label: 'Allow Create New',
					default: false,
					comment: 'Show "Create New" button in the list page header',
					span: 3
				}
			]
		},
		{
			name: 'table',
			type: 'group',
			label: 'Table Settings',
			columns: 6,
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
					span: 6
				}
			]
		},
		{
			name: 'columnsGroup',
			type: 'group',
			label: 'Columns Settings',
			columns: 12,
			fields: [
				{
					name: 'columns',
					type: 'custom',
					label: 'Table Columns',
					span: 12,
					renderer: ColumnEditor,
					default: [],
					comment: 'Configure table columns, their display types, and sorting behavior'
				}
			]
		}
	]
}
