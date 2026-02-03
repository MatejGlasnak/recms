'use client'

import type { FilterConfig } from '../../../types'
import { FilterInput } from './FilterInput'
import { FilterSelect } from './FilterSelect'
import { FilterCombobox } from './FilterCombobox'
import { FilterCheckbox } from './FilterCheckbox'

export interface FilterFieldProps {
	filter: FilterConfig
	value: unknown
	onChange: (value: unknown) => void
	onClear?: () => void
	disabled?: boolean
}

export function FilterField({ filter, value, onChange, disabled = false }: FilterFieldProps) {
	switch (filter.type) {
		case 'input':
			return (
				<FilterInput
					filter={filter}
					value={typeof value === 'string' ? value : ''}
					onChange={v => onChange(v)}
					disabled={disabled}
				/>
			)
		case 'select':
			return (
				<FilterSelect
					filter={filter}
					value={typeof value === 'string' ? value : ''}
					onChange={v => onChange(v)}
					disabled={disabled}
				/>
			)
		case 'combobox':
			return (
				<FilterCombobox
					filter={filter}
					value={value as string | string[]}
					onChange={onChange}
					disabled={disabled}
				/>
			)
		case 'checkbox':
			return (
				<FilterCheckbox
					filter={filter}
					value={value === true}
					onChange={v => onChange(v)}
					disabled={disabled}
				/>
			)
		default:
			return null
	}
}
