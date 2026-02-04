import type { BlockFieldConfig } from '../../registry'

export const gridConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'columnsMobile',
			type: 'slider',
			label: 'Columns (Mobile)',
			default: 1,
			min: 1,
			max: 12,
			step: 1,
			comment: 'Number of columns on mobile devices',
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
			comment: 'Number of columns on tablet devices',
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
			comment: 'Number of columns on desktop devices',
			span: 'full'
		}
	]
}
