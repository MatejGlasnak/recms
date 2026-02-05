import type { BlockDefinition } from '@blume/recms-core'

// List blocks
import { ListHeader } from './list/header/ListHeader'
import { listHeaderConfig } from './list/header/config'
import { ListFilters } from './list/filters/ListFilters'
import { listFiltersConfig } from './list/filters/config'
import { ListTable } from './list/table/ListTable'
import { listTableConfig } from './list/table/config'
import { ListPagination } from './list/pagination/ListPagination'
import { listPaginationConfig } from './list/pagination/config'

// Show blocks
import { ShowHeader } from './show/header/ShowHeader'
import { showHeaderConfig } from './show/header/config'
import { ShowContent } from './show/content/ShowContent'
import { showContentConfig } from './show/content/config'

// Edit blocks
import { EditHeader } from './edit/header/EditHeader'
import { editHeaderConfig } from './edit/header/config'
import { EditContent } from './edit/content/EditContent'
import { editContentConfig } from './edit/content/config'

// Create blocks
import { CreateHeader } from './create/header/CreateHeader'
import { createHeaderConfig } from './create/header/config'
import { CreateContent } from './create/content/CreateContent'
import { createContentConfig } from './create/content/config'

// Layout blocks
import { Grid } from '../layouts/grid/Grid'
import { gridConfig } from '../layouts/grid/config'
import { Tabs } from '../layouts/tabs/Tabs'
import { tabsConfig } from '../layouts/tabs/config'

/**
 * Built-in block definitions
 * These are automatically registered when RecmsProvider is mounted
 */
export const builtInBlocks: BlockDefinition[] = [
	// List page blocks
	{
		slug: 'list-header',
		Component: ListHeader,
		config: listHeaderConfig,
		label: 'List Header',
		description: 'Header section for list pages with title and edit mode toggle'
	},
	{
		slug: 'list-filters',
		Component: ListFilters,
		config: listFiltersConfig,
		label: 'List Filters',
		description: 'Filter controls for list pages'
	},
	{
		slug: 'list-table',
		Component: ListTable,
		config: listTableConfig,
		label: 'List Table',
		description: 'Data table for list pages with sortable columns'
	},
	{
		slug: 'list-pagination',
		Component: ListPagination,
		config: listPaginationConfig,
		label: 'List Pagination',
		description: 'Pagination controls for list pages'
	},

	// Show page blocks
	{
		slug: 'show-header',
		Component: ShowHeader,
		config: showHeaderConfig,
		label: 'Show Header',
		description: 'Header section for show pages'
	},
	{
		slug: 'show-content',
		Component: ShowContent,
		config: showContentConfig,
		label: 'Show Content',
		description: 'Content display for show pages'
	},

	// Edit page blocks
	{
		slug: 'edit-header',
		Component: EditHeader,
		config: editHeaderConfig,
		label: 'Edit Header',
		description: 'Header section for edit pages'
	},
	{
		slug: 'edit-content',
		Component: EditContent,
		config: editContentConfig,
		label: 'Edit Content',
		description: 'Form content for edit pages'
	},

	// Create page blocks
	{
		slug: 'create-header',
		Component: CreateHeader,
		config: createHeaderConfig,
		label: 'Create Header',
		description: 'Header section for create pages'
	},
	{
		slug: 'create-content',
		Component: CreateContent,
		config: createContentConfig,
		label: 'Create Content',
		description: 'Form content for create pages'
	},

	// Layout blocks
	{
		slug: 'grid',
		Component: Grid,
		config: gridConfig,
		label: 'Grid Layout',
		description: 'Responsive grid layout for organizing blocks'
	},
	{
		slug: 'tabs',
		Component: Tabs,
		config: tabsConfig,
		label: 'Tabs Layout',
		description: 'Tabbed layout for organizing content'
	}
]
