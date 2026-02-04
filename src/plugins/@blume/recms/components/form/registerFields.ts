import { TextField } from './field-types/text-field'
import { TextareaField } from './field-types/textarea-field'
import { DropdownField } from './field-types/dropdown-field'
import { CheckboxField } from './field-types/checkbox-field'
import { SwitchField } from './field-types/switch-field'
import { NumberField } from './field-types/number-field'
import { RepeaterField } from './field-types/repeater-field'
import { SliderField } from './field-types/slider-field'
import type { FieldRegistry } from '../registry/FieldRegistry'

export function registerAllFields(registerField: FieldRegistry['registerField']) {
	registerField({ type: 'text', Component: TextField })
	registerField({ type: 'textarea', Component: TextareaField })
	registerField({ type: 'select', Component: DropdownField })
	registerField({ type: 'dropdown', Component: DropdownField })
	registerField({ type: 'checkbox', Component: CheckboxField })
	registerField({ type: 'switch', Component: SwitchField })
	registerField({ type: 'number', Component: NumberField })
	registerField({ type: 'repeater', Component: RepeaterField })
	registerField({ type: 'slider', Component: SliderField })
}
