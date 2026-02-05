import type { FilterDefinition } from '@blume/recms-core'

// Filter components
import { FilterInput } from './filter-input/FilterInput'
import { filterInputConfig } from './filter-input/config'
import { FilterSelect } from './filter-select/FilterSelect'
import { filterSelectConfig } from './filter-select/config'
import { FilterCombobox } from './filter-combobox/FilterCombobox'
import { filterComboboxConfig } from './filter-combobox/config'
import { FilterCheckbox } from './filter-checkbox/FilterCheckbox'
import { filterCheckboxConfig } from './filter-checkbox/config'

/**
 * Built-in filter definitions
 * These are automatically registered when RecmsProvider is mounted
 */
export const builtInFilters: FilterDefinition[] = [
	{
		slug: 'filter-input',
		Component: FilterInput,
		config: filterInputConfig,
		label: 'Input Filter',
		description: 'Text input filter'
	},
	{
		slug: 'filter-select',
		Component: FilterSelect,
		config: filterSelectConfig,
		label: 'Select Filter',
		description: 'Dropdown select filter'
	},
	{
		slug: 'filter-combobox',
		Component: FilterCombobox,
		config: filterComboboxConfig,
		label: 'Combobox Filter',
		description: 'Searchable combobox filter'
	},
	{
		slug: 'filter-checkbox',
		Component: FilterCheckbox,
		config: filterCheckboxConfig,
		label: 'Checkbox Filter',
		description: 'Checkbox filter for boolean values'
	}
]
