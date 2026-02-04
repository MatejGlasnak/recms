import type { BlockConfig } from '../../../types'

export interface TabItem {
	id: string
	label: string
	blocks: BlockConfig[]
}

export interface TabsConfig {
	tabs: TabItem[]
	defaultTab?: string
	orientation?: 'horizontal' | 'vertical'
	variant?: 'default' | 'pills' | 'underline'
	allowedBlockTypes?: string[]
}
