// @blume/recms - Public API
// Types
export type {
	FilterConfig,
	ColumnConfig,
	ListConfig,
	ListConfigFormData,
	ShowConfig
} from './types'

// Hooks
export { useListConfig, useUpdateListConfig, useShowConfig, useUpdateShowConfig } from './hooks'

// Utils
export { formatHeader, getPageNumbers, buildListFilters } from './utils'

// UI
export { EditableWrapper } from './components/ui/EditableWrapper'

// List components
export { ListPage } from './pages/resources/ListPage'
export { ListPageLayout } from './components/list/ListPageLayout'

// Show components
export { ShowPage } from './pages/resources/ShowPage'
export { ShowPageLayout } from './components/show/ShowPageLayout'
export { ShowFieldsEditor } from './components/show/ShowFieldsEditor'
export { ListPageHeader } from './components/list/ListPageHeader'
export { ListPageFilters } from './components/list/ListPageFilters'
export { ListPageTable } from './components/list/ListPageTable'
export { ListPageTitle } from './components/list/ListPageTitle'
export { ListPageDescription } from './components/list/ListPageDescription'
export { ListPagination } from './components/list/ListPagination'
export { FilterField } from './components/list/filters/FilterField'
export { ColumnCell } from './components/list/columns/ColumnCell'
export { ListFiltersEditor } from './components/list/filters-editor/ListFiltersEditor'
export { ListColumnsEditor } from './components/list/columns-editor/ListColumnsEditor'

// Per-type filter/column components for overrides
export { FilterInput } from './components/list/filters/FilterInput'
export { FilterSelect } from './components/list/filters/FilterSelect'
export { FilterCombobox } from './components/list/filters/FilterCombobox'
export { FilterCheckbox } from './components/list/filters/FilterCheckbox'
export { ColumnText } from './components/list/columns/ColumnText'
export { ColumnNumber } from './components/list/columns/ColumnNumber'
export { ColumnDate } from './components/list/columns/ColumnDate'
export { ColumnBoolean } from './components/list/columns/ColumnBoolean'
export { ColumnBadge } from './components/list/columns/ColumnBadge'
export { ColumnJson } from './components/list/columns/ColumnJson'
