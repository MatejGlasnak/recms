import type { FilterConfig, ListConfig } from '../types'

export interface RefineFilterItem {
	field: string
	operator: string
	value: unknown
}

export function buildListFilters(
	filterValues: Record<string, unknown>,
	listConfig: ListConfig | undefined
): RefineFilterItem[] {
	const filterList: RefineFilterItem[] = []
	const configuredFilters = listConfig?.filters || []

	Object.entries(filterValues).forEach(([field, value]) => {
		if (value === undefined || value === null || value === '') {
			return
		}

		if (Array.isArray(value) && value.length === 0) {
			return
		}

		const filterConfig = configuredFilters.find((f: FilterConfig) => f.field === field)
		const operator = filterConfig?.operator || 'eq'

		if (typeof value === 'boolean') {
			if (value) {
				filterList.push({ field, operator, value: true })
			}
			return
		}

		if (Array.isArray(value)) {
			filterList.push({
				field,
				operator: filterConfig?.operator || 'in',
				value
			})
			return
		}

		if (field === 'search') {
			filterList.push({
				field: 'search',
				operator: 'contains',
				value
			})
		} else {
			filterList.push({ field, operator, value })
		}
	})

	return filterList
}
