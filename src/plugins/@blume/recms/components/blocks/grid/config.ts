import type { BlockFieldConfig } from '../../registry'
import { SliderField } from './SliderField'

export const gridConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'columnsMobile',
			type: 'custom',
			label: 'Columns (Mobile)',
			default: 1,
			comment: 'Number of columns on mobile devices (1-12)',
			span: 'full',
			renderer: SliderField
		},
		{
			name: 'columnsTablet',
			type: 'custom',
			label: 'Columns (Tablet)',
			default: 3,
			comment: 'Number of columns on tablet devices (1-12)',
			span: 'full',
			renderer: SliderField
		},
		{
			name: 'columnsDesktop',
			type: 'custom',
			label: 'Columns (Desktop)',
			default: 6,
			comment: 'Number of columns on desktop devices (1-12)',
			span: 'full',
			renderer: SliderField
		}
	]
}
