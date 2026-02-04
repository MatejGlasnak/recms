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
	listPaginationConfig,
	ShowHeader,
	showHeaderConfig,
	ShowContent,
	showContentConfig
} from './components/blocks'

// Pages (new block-based)
export { ListPage } from './components/pages/list'
export { ShowPageNew } from './pages/resources/ShowPageNew'

// Legacy pages (for backward compatibility)
export { ShowPage } from './pages/resources/ShowPage'
export { ShowPageLayout } from './components/show/ShowPageLayout'
export { ShowFieldsEditor } from './components/show/ShowFieldsEditor'
