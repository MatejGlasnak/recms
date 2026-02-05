import { TextField } from './text-field'
import { TextareaField } from './textarea-field'
import { DropdownField } from './dropdown-field'
import { ComboboxField } from './combobox-field'
import { CheckboxField } from './checkbox-field'
import { SwitchField } from './switch-field'
import { NumberField } from './number-field'
import { RepeaterField } from './repeater-field'
import { SliderField } from './slider-field'
import type { FieldTypeDefinition } from '@blume/recms-core'

/**
 * Built-in field definitions
 * These are automatically registered when RecmsProvider is mounted
 */
export const builtInFields: FieldTypeDefinition[] = [
	{ type: 'text', Component: TextField, label: 'Text Field' },
	{ type: 'textarea', Component: TextareaField, label: 'Textarea Field' },
	{ type: 'select', Component: DropdownField, label: 'Select Field' },
	{ type: 'dropdown', Component: DropdownField, label: 'Dropdown Field' },
	{ type: 'combobox', Component: ComboboxField, label: 'Combobox Field' },
	{ type: 'checkbox', Component: CheckboxField, label: 'Checkbox Field' },
	{ type: 'switch', Component: SwitchField, label: 'Switch Field' },
	{ type: 'number', Component: NumberField, label: 'Number Field' },
	{ type: 'repeater', Component: RepeaterField, label: 'Repeater Field' },
	{ type: 'slider', Component: SliderField, label: 'Slider Field' }
]

/**
 * @deprecated Use builtInFields array instead
 * Legacy function for backwards compatibility
 */
export function registerAllFields(registerField: (definition: FieldTypeDefinition) => void) {
	builtInFields.forEach(field => registerField(field))
}
