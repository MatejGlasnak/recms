import type { BlockConfig } from '../../../types'
import type { RegistryType } from '../../../core/registries/types'

export interface GridItem {
	id: string
	slug: string
	type: RegistryType
	columnSpan?: number
	config: Record<string, unknown>
}

export interface TabItem {
	id: string
	label: string
	icon?: string
	blocks: BlockConfig[] // Legacy support
	items?: GridItem[] // New: Can be blocks, fields, or filters
	gridConfig?: {
		columnsMobile?: number
		columnsTablet?: number
		columnsDesktop?: number
	}
}

export interface TabsConfig {
	tabs: TabItem[]
	defaultTab?: string
	orientation?: 'horizontal' | 'vertical'
	variant?: 'default' | 'pills' | 'underline'

	// Nesting configuration
	registryType?: RegistryType // Which registry to use
	allowedSlugs?: string[] // Specific slugs allowed
	allowedBlockTypes?: string[] // Legacy support
}
