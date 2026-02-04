// @blume/recms - Public API
// Types
export type {
	FilterConfig,
	ColumnConfig,
	ListConfig,
	ListConfigFormData,
	ShowConfig,
	BlockConfig,
	PageConfig,
	LegacyListConfig
} from './types'

// Hooks
export {
	useListConfig,
	useUpdateListConfig,
	useShowConfig,
	useUpdateShowConfig,
	usePageConfig,
	useUpdatePageConfig
} from './hooks'

// Utils
export { formatHeader, getPageNumbers, buildListFilters } from './utils'

// UI
export { EditableWrapper } from './components/ui/EditableWrapper'

// Registry
export {
	BlockRegistryProvider,
	useBlockRegistry,
	useRegisterBlock,
	useBlock,
	FieldRegistryProvider,
	useFieldRegistry,
	useRegisterField,
	useField
} from './components/registry'
export type {
	BlockDefinition,
	BlockComponentProps,
	BlockFieldConfig,
	FieldDefinition,
	TriggerConfig,
	PresetConfig,
	TabDefinition,
	FieldTypeDefinition,
	FieldComponentProps
} from './components/registry'

// Form components
export { FormModal, FormField } from './components/form'
export {
	TextField,
	TextareaField,
	DropdownField,
	CheckboxField,
	NumberField,
	RepeaterField,
	SliderField
} from './components/form/field-types'

// Filter components (new structure)
export {
	FilterInput,
	filterInputConfig,
	FilterSelect,
	filterSelectConfig,
	FilterCombobox,
	filterComboboxConfig,
	FilterCheckbox,
	filterCheckboxConfig
} from './components/filters'

// Column components (new structure)
export {
	ColumnText,
	columnTextConfig,
	ColumnNumber,
	columnNumberConfig,
	ColumnDate,
	columnDateConfig,
	ColumnBoolean,
	columnBooleanConfig,
	ColumnBadge,
	columnBadgeConfig,
	ColumnJson,
	columnJsonConfig
} from './components/columns'

// Block components
export {
	ListHeader,
	listHeaderConfig,
	ListFilters,
	listFiltersConfig,
	ListTable,
	listTableConfig,
	ListPagination,
	listPaginationConfig
} from './components/blocks'

// Pages (new block-based)
export { ListPage } from './components/pages/list'

// Legacy pages (for backward compatibility)
export { ShowPage } from './pages/resources/ShowPage'

// Legacy list components (for backward compatibility)
export { ListPageLayout } from './components/list/ListPageLayout'
export { ShowPageLayout } from './components/show/ShowPageLayout'
export { ShowFieldsEditor } from './components/show/ShowFieldsEditor'
export { ListPageHeader } from './components/list/ListPageHeader'
export { ListPageFilters } from './components/list/ListPageFilters'
export { ListPageTable } from './components/list/ListPageTable'
export { ListPageTitle } from './components/list/ListPageTitle'
export { ListPageDescription } from './components/list/ListPageDescription'
export { ListPagination as LegacyListPagination } from './components/list/ListPagination'
export { FilterField } from './components/list/filters/FilterField'
export { ColumnCell } from './components/list/columns/ColumnCell'
export { ListFiltersEditor } from './components/list/filters-editor/ListFiltersEditor'
export { ListColumnsEditor } from './components/list/columns-editor/ListColumnsEditor'

// Legacy filter/column components
export { FilterInput as LegacyFilterInput } from './components/list/filters/FilterInput'
export { FilterSelect as LegacyFilterSelect } from './components/list/filters/FilterSelect'
export { FilterCombobox as LegacyFilterCombobox } from './components/list/filters/FilterCombobox'
export { FilterCheckbox as LegacyFilterCheckbox } from './components/list/filters/FilterCheckbox'
export { ColumnText as LegacyColumnText } from './components/list/columns/ColumnText'
export { ColumnNumber as LegacyColumnNumber } from './components/list/columns/ColumnNumber'
export { ColumnDate as LegacyColumnDate } from './components/list/columns/ColumnDate'
export { ColumnBoolean as LegacyColumnBoolean } from './components/list/columns/ColumnBoolean'
export { ColumnBadge as LegacyColumnBadge } from './components/list/columns/ColumnBadge'
export { ColumnJson as LegacyColumnJson } from './components/list/columns/ColumnJson'
