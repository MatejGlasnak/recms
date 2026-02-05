import type { BlockFieldConfig } from '../../../core/registries/types'

/**
 * Map of column numbers to Tailwind grid-cols classes
 */
const GRID_COLS_MAP: Record<number, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
	5: 'grid-cols-5',
	6: 'grid-cols-6',
	7: 'grid-cols-7',
	8: 'grid-cols-8',
	9: 'grid-cols-9',
	10: 'grid-cols-10',
	11: 'grid-cols-11',
	12: 'grid-cols-12'
}

/**
 * Map of column numbers to Tailwind md:grid-cols classes (tablet)
 */
const MD_GRID_COLS_MAP: Record<number, string> = {
	1: 'md:grid-cols-1',
	2: 'md:grid-cols-2',
	3: 'md:grid-cols-3',
	4: 'md:grid-cols-4',
	5: 'md:grid-cols-5',
	6: 'md:grid-cols-6',
	7: 'md:grid-cols-7',
	8: 'md:grid-cols-8',
	9: 'md:grid-cols-9',
	10: 'md:grid-cols-10',
	11: 'md:grid-cols-11',
	12: 'md:grid-cols-12'
}

/**
 * Map of column numbers to Tailwind lg:grid-cols classes (desktop)
 */
const LG_GRID_COLS_MAP: Record<number, string> = {
	1: 'lg:grid-cols-1',
	2: 'lg:grid-cols-2',
	3: 'lg:grid-cols-3',
	4: 'lg:grid-cols-4',
	5: 'lg:grid-cols-5',
	6: 'lg:grid-cols-6',
	7: 'lg:grid-cols-7',
	8: 'lg:grid-cols-8',
	9: 'lg:grid-cols-9',
	10: 'lg:grid-cols-10',
	11: 'lg:grid-cols-11',
	12: 'lg:grid-cols-12'
}

/**
 * Generates Tailwind grid column classes based on breakpoint values
 * Breakpoints: mobile (default), md (768px), lg (1024px)
 */
export function getGridClasses(mobile: number, tablet: number, desktop: number): string {
	const classes: string[] = []

	// Mobile (default, no prefix)
	classes.push(GRID_COLS_MAP[mobile] || `grid-cols-${mobile}`)

	// Tablet (md: 768px+)
	if (tablet !== mobile) {
		classes.push(MD_GRID_COLS_MAP[tablet] || `md:grid-cols-${tablet}`)
	}

	// Desktop (lg: 1024px+)
	if (desktop !== tablet) {
		classes.push(LG_GRID_COLS_MAP[desktop] || `lg:grid-cols-${desktop}`)
	}

	return classes.join(' ')
}

/**
 * Map of column span numbers to Tailwind col-span classes
 */
const COL_SPAN_MAP: Record<number, string> = {
	1: 'col-span-1',
	2: 'col-span-2',
	3: 'col-span-3',
	4: 'col-span-4',
	5: 'col-span-5',
	6: 'col-span-6',
	7: 'col-span-7',
	8: 'col-span-8',
	9: 'col-span-9',
	10: 'col-span-10',
	11: 'col-span-11',
	12: 'col-span-12'
}

/**
 * Generates Tailwind col-span class for a given span value
 */
export function getColSpanClass(span: number): string {
	return COL_SPAN_MAP[span] || `col-span-${span}`
}

export const gridConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'registryType',
			type: 'dropdown',
			label: 'Component Type',
			options: [
				{ label: 'Blocks', value: 'block' },
				{ label: 'Fields', value: 'field' },
				{ label: 'Filters', value: 'filter' }
			],
			default: 'block',
			comment: 'Type of components this grid can contain',
			span: 'full'
		},
		{
			name: 'columnsMobile',
			type: 'slider',
			label: 'Columns (Mobile)',
			default: 1,
			min: 1,
			max: 12,
			step: 1,
			comment: 'Mobile devices (< 768px)',
			span: 'full'
		},
		{
			name: 'columnsTablet',
			type: 'slider',
			label: 'Columns (Tablet)',
			default: 3,
			min: 1,
			max: 12,
			step: 1,
			comment: 'Tablet devices (≥ 768px)',
			span: 'full'
		},
		{
			name: 'columnsDesktop',
			type: 'slider',
			label: 'Columns (Desktop)',
			default: 6,
			min: 1,
			max: 12,
			step: 1,
			comment: 'Desktop devices (≥ 1024px)',
			span: 'full'
		}
	]
}
