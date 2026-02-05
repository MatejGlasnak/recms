export interface CreateFieldConfig {
	id: string
	field: string
	label?: string
	type:
		| 'text'
		| 'textarea'
		| 'number'
		| 'dropdown'
		| 'combobox'
		| 'checkbox'
		| 'switch'
		| 'slider'
	colspan?: number
	required?: boolean
	placeholder?: string
	options?: Array<{ label: string; value: string | number }>
	disabled?: boolean
	readOnly?: boolean
}
