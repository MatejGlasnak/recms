import type { BlockFieldConfig } from '../../registry'

export const listFiltersConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'filters',
			type: 'repeater',
			label: 'Filters',
			span: 'full',
			default: [],
			comment: 'Configure filters for the list page',
			form: {
				fields: [
					{
						name: 'id',
						type: 'text',
						label: 'Filter ID',
						placeholder: 'Auto-generated',
						comment: 'Unique identifier for this filter',
						readOnly: true,
						hidden: true,
						span: 'full'
					},
					{
						name: 'type',
						type: 'select',
						label: 'Filter Type',
						default: 'input',
						options: [
							{ label: 'Input', value: 'input' },
							{ label: 'Select', value: 'select' },
							{ label: 'Combobox', value: 'combobox' },
							{ label: 'Checkbox', value: 'checkbox' }
						],
						span: 'left'
					},
					{
						name: 'label',
						type: 'text',
						label: 'Label',
						placeholder: 'e.g., Status, Category',
						required: true,
						span: 'right'
					},
					{
						name: 'field',
						type: 'text',
						label: 'Field Name',
						placeholder: 'e.g., status, category, isActive',
						required: true,
						comment: 'The database field to filter on',
						span: 'left'
					},
					{
						name: 'operator',
						type: 'select',
						label: 'Operator',
						default: 'contains',
						options: [
							{ label: 'Equals (eq)', value: 'eq' },
							{ label: 'Not Equals (ne)', value: 'ne' },
							{ label: 'Contains', value: 'contains' },
							{ label: 'Starts With', value: 'startsWith' },
							{ label: 'Ends With', value: 'endsWith' },
							{ label: 'Greater Than (gt)', value: 'gt' },
							{ label: 'Greater Than or Equal (gte)', value: 'gte' },
							{ label: 'Less Than (lt)', value: 'lt' },
							{ label: 'Less Than or Equal (lte)', value: 'lte' },
							{ label: 'In (in)', value: 'in' },
							{ label: 'Not In (nin)', value: 'nin' }
						],
						span: 'right'
					},
					{
						name: 'placeholder',
						type: 'text',
						label: 'Placeholder',
						placeholder: 'e.g., Search by name, Select a category',
						comment:
							'Optional placeholder text for input, select, and combobox filters',
						span: 'full'
					},
					{
						name: 'multiple',
						type: 'checkbox',
						label: 'Allow Multiple Selections',
						default: false,
						comment: 'Only applies to combobox filters',
						span: 'full'
					},
					{
						name: 'options',
						type: 'repeater',
						label: 'Options',
						comment: 'Required for select and combobox filters',
						span: 'full',
						default: [],
						form: {
							fields: [
								{
									name: 'label',
									type: 'text',
									label: 'Label',
									placeholder: 'Display text',
									required: true,
									span: 'left'
								},
								{
									name: 'value',
									type: 'text',
									label: 'Value',
									placeholder: 'Actual value',
									required: true,
									span: 'right'
								}
							]
						}
					}
				]
			}
		}
	]
}
