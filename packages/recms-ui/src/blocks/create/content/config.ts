import type { BlockFieldConfig } from '@blume/recms-core'

/**
 * Static config for block registration
 */
export const createContentConfig: BlockFieldConfig = {
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

/**
 * Generate dynamic config for create content
 */
export function getCreateContentConfig(): BlockFieldConfig {
	const typeOptions = [
		{ label: 'Text', value: 'text' },
		{ label: 'Textarea', value: 'textarea' },
		{ label: 'Number', value: 'number' },
		{ label: 'Dropdown', value: 'dropdown' },
		{ label: 'Combobox', value: 'combobox' },
		{ label: 'Checkbox', value: 'checkbox' },
		{ label: 'Switch', value: 'switch' },
		{ label: 'Slider', value: 'slider' }
	]

	return {
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
				name: 'fields',
				type: 'repeater',
				label: 'Field',
				default: [],
				span: 'full',
				form: {
					fields: [
						{
							name: 'id',
							type: 'text',
							label: 'ID',
							default: () => `field-${Date.now()}`,
							span: 0 // Hidden field
						},
						{
							name: 'basic',
							type: 'group',
							label: 'Basic Information',
							columns: 12,
							fields: [
								{
									name: 'label',
									type: 'text',
									label: 'Label',
									placeholder: 'Display label (leave empty to use field name)',
									span: 6
								},
								{
									name: 'field',
									type: 'text',
									label: 'Field Name',
									required: true,
									placeholder: 'e.g., title, description, status',
									span: 6
								},
								{
									name: 'type',
									type: 'dropdown',
									label: 'Type',
									options: typeOptions,
									default: 'text',
									span: 4
								},
								{
									name: 'required',
									type: 'switch',
									label: 'Required',
									default: false,
									span: 4
								},
								{
									name: 'placeholder',
									type: 'text',
									label: 'Placeholder',
									placeholder: 'Optional placeholder text',
									span: 4
								}
							]
						},
						{
							name: 'layout',
							type: 'group',
							label: 'Layout',
							columns: 12,
							fields: [
								{
									name: 'colspan',
									type: 'slider',
									label: 'Column Span',
									default: 1,
									min: 1,
									max: 12,
									step: 1,
									span: 12
								}
							]
						}
					]
				}
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
}
