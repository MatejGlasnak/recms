/**
 * Show page configuration. Can use tabs with groups and items, or legacy
 * showFieldOrder (subset of list columns). If tabs are present, they are used;
 * otherwise showFieldOrder / enabledByDefault columns are used.
 */

export type ShowItemType = 'number' | 'date' | 'text' | 'richtext'

export interface ShowItem {
	/** Field name from the record to display. */
	field: string
	type: ShowItemType
	/** Optional override for the field label. */
	label?: string
	/** Number of columns this item spans in the group grid (default 1). */
	colspan?: number
}

export interface ShowGroup {
	/** Group heading (name or label). */
	label?: string
	name?: string
	/** Optional description below the heading. */
	description?: string
	/** Number of columns (default 1). */
	columns?: number
	/** Items per column: columnItems[columnIndex] = items in that column. */
	columnItems?: ShowItem[][]
	/** Flat list of items with colspan; used when present for grid layout. */
	items?: ShowItem[]
	/** Whether to show the label in the UI (default true). */
	showLabel?: boolean
}

export interface ShowTab {
	/** Tab trigger label. */
	label: string
	/** Heading shown in the card for this tab. */
	showLabel?: string
	/** Optional description below the card heading. */
	description?: string
	groups: ShowGroup[]
}

export interface ShowConfig {
	id: string | null
	resourceId: string
	/** @deprecated Use tabs instead. Field names to display, in order. */
	showFieldOrder?: string[]
	/** When false, tabs are hidden (in edit mode shown with reduced opacity). */
	showTabs?: boolean
	/** Tab-based layout: each tab has showLabel (card heading), description, and groups. */
	tabs?: ShowTab[]
	/**
	 * @deprecated No longer used. Content lives only in tabs; create a tab then add groups.
	 */
	defaultGroups?: ShowGroup[]
}
