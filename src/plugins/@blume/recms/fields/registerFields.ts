import { TextField } from './text-field'
import { TextareaField } from './textarea-field'
import { DropdownField } from './dropdown-field'
import { ComboboxField } from './combobox-field'
import { CheckboxField } from './checkbox-field'
import { SwitchField } from './switch-field'
import { NumberField } from './number-field'
import { RepeaterField } from './repeater-field'
import { SliderField } from './slider-field'
import type { FieldTypeDefinition } from '../core/registries/types'

export function registerAllFields(registerField: (definition: FieldTypeDefinition) => void) {
	registerField({ type: 'text', Component: TextField })
	registerField({ type: 'textarea', Component: TextareaField })
	registerField({ type: 'select', Component: DropdownField })
	registerField({ type: 'dropdown', Component: DropdownField })
	registerField({ type: 'combobox', Component: ComboboxField })
	registerField({ type: 'checkbox', Component: CheckboxField })
	registerField({ type: 'switch', Component: SwitchField })
	registerField({ type: 'number', Component: NumberField })
	registerField({ type: 'repeater', Component: RepeaterField })
	registerField({ type: 'slider', Component: SliderField })
}
