import type { BlockFieldConfig } from '../../../core/registries/types'
import { FieldEditor } from './FieldEditor'

export const showContentConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'layout',
			type: 'group',
			label: 'Layout Settings',
			columns: 6,
			fields: [
				{
					name: 'columns',
					type: 'dropdown',
					label: 'Number of Columns',
					options: [
						{ label: '1 Column', value: '1' },
						{ label: '2 Columns', value: '2' },
						{ label: '3 Columns', value: '3' },
						{ label: '4 Columns', value: '4' }
					],
					default: '2',
					comment: 'Number of columns in the grid layout',
					span: 6
				}
			]
		},
		{
			name: 'fieldsGroup',
			type: 'group',
			label: 'Fields Configuration',
			columns: 12,
			fields: [
				{
					name: 'fields',
					type: 'custom',
					label: 'Fields',
					span: 12,
					renderer: FieldEditor,
					default: [],
					comment: 'Configure fields to display in this section'
				}
			]
		},
		{
			name: 'card',
			type: 'group',
			label: 'Card Settings',
			columns: 6,
			fields: [
				{
					name: 'showCard',
					type: 'switch',
					label: 'Show Card',
					default: true,
					comment: 'Wrap content in a card',
					span: 2
				},
				{
					name: 'cardTitle',
					type: 'text',
					label: 'Card Title',
					placeholder: 'Optional card title',
					span: 4
				},
				{
					name: 'cardDescription',
					type: 'text',
					label: 'Card Description',
					placeholder: 'Optional card description',
					span: 6
				}
			]
		}
	]
}
