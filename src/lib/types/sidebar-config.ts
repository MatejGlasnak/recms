export type SidebarItemType = 'resource' | 'link' | 'group'

export interface BaseSidebarItem {
	id: string
	type: SidebarItemType
	icon?: string
	label?: string
}

export interface ResourceSidebarItem extends BaseSidebarItem {
	type: 'resource'
	resourceId: string
	resourceName: string // Fallback label
}

export interface LinkSidebarItem extends BaseSidebarItem {
	type: 'link'
	href: string
	label: string
}

export interface GroupSidebarItem extends BaseSidebarItem {
	type: 'group'
	label: string
	items: SidebarItem[]
	isOpen?: boolean
}

export type SidebarItem = ResourceSidebarItem | LinkSidebarItem | GroupSidebarItem

export interface SidebarGroup {
	id: string
	title?: string
	maxItems?: number
	items: SidebarItem[]
}

export interface SidebarConfig {
	groups: SidebarGroup[]
}
