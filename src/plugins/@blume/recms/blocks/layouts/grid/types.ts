import type { RegistryType } from '../../../core/registries/types'

export interface GridConfig {
	// Layout configuration
	columns?: number
	columnsMobile?: number
	columnsTablet?: number
	columnsDesktop?: number
	gap?: number

	// Nesting configuration
	registryType?: RegistryType // Which registry to use for lookups
	allowedSlugs?: string[] // Specific slugs allowed (e.g., ['text', 'number'])

	// Nested components
	items?: GridItem[] // Renamed from 'blocks' for clarity
}

export interface GridItem {
	id: string
	slug: string // Component slug (e.g., 'text', 'filter-input')
	type: RegistryType // Component type
	columnSpan?: number
	config: Record<string, unknown>
}
