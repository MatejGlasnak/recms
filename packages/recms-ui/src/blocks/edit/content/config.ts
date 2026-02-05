import type { BlockFieldConfig } from '@blume/recms-core'

/**
 * Extract field names and infer types from a record object
 * Handles nested objects recursively
 */
function extractFieldsFromRecord(
	record: Record<string, unknown> | null | undefined,
	prefix = '',
	level = 0
): Array<{
	value: string
	label: string
	type: string
	icon?: string
}> {
	if (!record) return []

	const fields: Array<{ value: string; label: string; type: string; icon?: string }> = []

	const inferType = (value: unknown): string => {
		if (value === null || value === undefined) return 'text'
		if (typeof value === 'boolean') return 'switch'
		if (typeof value === 'number') return 'number'
		if (typeof value === 'string') {
			// Check if it's a date string
			if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'text'
			// Long text should use textarea
			if (value.length > 100) return 'textarea'
			return 'text'
		}
		if (typeof value === 'object') {
			if (Array.isArray(value)) return 'text'
			return 'text'
		}
		return 'text'
	}

	Object.keys(record).forEach(key => {
		const value = record[key]
		const fieldPath = prefix ? `${prefix}.${key}` : key
		const type = inferType(value)

		// Add the field itself
		fields.push({
			value: fieldPath,
			label: fieldPath,
			type,
			icon: level > 0 ? 'chevron-right' : undefined
		})

		// If it's an object (not array, not null), recursively extract nested fields
		if (
			value &&
			typeof value === 'object' &&
			!Array.isArray(value) &&
			level < 2 // Limit nesting to 2 levels to avoid too deep recursion
		) {
			const nestedFields = extractFieldsFromRecord(
				value as Record<string, unknown>,
				fieldPath,
				level + 1
			)
			fields.push(...nestedFields)
		}
	})

	return level === 0 ? fields.sort((a, b) => a.label.localeCompare(b.label)) : fields
}

/**
 * Static config for block registration (without dynamic field options)
 */
export const editContentConfig: BlockFieldConfig = {
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
 * Generate dynamic config based on available record data
 */
export function getEditContentConfig(
	record: Record<string, unknown> | null | undefined
): BlockFieldConfig {
	const availableFields = extractFieldsFromRecord(record)
	const fieldOptions = availableFields.map(f => ({ label: f.label, value: f.value }))

	// Get unique types from available fields
	const availableTypes = Array.from(new Set(availableFields.map(f => f.type)))
	const typeOptions = [
		{ label: 'Text', value: 'text' },
		{ label: 'Textarea', value: 'textarea' },
		{ label: 'Number', value: 'number' },
		{ label: 'Dropdown', value: 'dropdown' },
		{ label: 'Combobox', value: 'combobox' },
		{ label: 'Checkbox', value: 'checkbox' },
		{ label: 'Switch', value: 'switch' },
		{ label: 'Slider', value: 'slider' }
	].filter(opt => availableTypes.includes(opt.value) || opt.value === 'text')

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
									type: 'combobox',
									label: 'Field',
									required: true,
									placeholder:
										fieldOptions.length > 0
											? 'Search or select field...'
											: 'Type field name...',
									options: fieldOptions,
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
