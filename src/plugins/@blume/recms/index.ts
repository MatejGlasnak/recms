// @blume/recms - Public API

// ============================================
// CORE EXPORTS (New Architecture)
// ============================================

// Core: Providers, Registries, Config
export * from './core'

// Pages: Main public API
export * from './pages'

// ============================================
// TYPES
// ============================================

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

// ============================================
// HOOKS
// ============================================

export {
	useListConfig,
	useUpdateListConfig,
	useShowConfig,
	useUpdateShowConfig,
	usePageConfig,
	useUpdatePageConfig
} from './hooks'

// ============================================
// UTILITIES
// ============================================

export { formatHeader, getPageNumbers, buildListFilters } from './utils'

// ============================================
// COMPONENTS (Tree-shakeable)
// ============================================

// Blocks
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
	showContentConfig,
	EditHeader,
	editHeaderConfig,
	EditContent,
	editContentConfig,
	CreateHeader,
	createHeaderConfig,
	CreateContent,
	createContentConfig,
	Grid,
	gridConfig,
	Tabs,
	tabsConfig
} from './blocks'

// Columns
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
} from './columns'

// Filters
export {
	FilterInput,
	filterInputConfig,
	FilterSelect,
	filterSelectConfig,
	FilterCombobox,
	filterComboboxConfig,
	FilterCheckbox,
	filterCheckboxConfig
} from './filters'

// Form fields
export {
	TextField,
	TextareaField,
	DropdownField,
	CheckboxField,
	NumberField,
	RepeaterField,
	SliderField,
	SwitchField
} from './fields'

// UI components
export {
	BlockRenderer,
	EditableWrapper,
	ConfigEmptyState,
	PageLoading,
	PageError,
	InlineError,
	FormModal,
	FormField
} from './ui'

// ============================================
// LEGACY EXPORTS (Backward Compatibility)
// ============================================

// No legacy exports needed - all components are now in blocks/
