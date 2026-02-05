import type { ColumnDefinition } from '@blume/recms-core'

// Column components
import { ColumnText } from './column-text/ColumnText'
import { columnTextConfig } from './column-text/config'
import { ColumnNumber } from './column-number/ColumnNumber'
import { columnNumberConfig } from './column-number/config'
import { ColumnDate } from './column-date/ColumnDate'
import { columnDateConfig } from './column-date/config'
import { ColumnBoolean } from './column-boolean/ColumnBoolean'
import { columnBooleanConfig } from './column-boolean/config'
import { ColumnBadge } from './column-badge/ColumnBadge'
import { columnBadgeConfig } from './column-badge/config'
import { ColumnJson } from './column-json/ColumnJson'
import { columnJsonConfig } from './column-json/config'

/**
 * Built-in column definitions
 * These are automatically registered when RecmsProvider is mounted
 */
export const builtInColumns: ColumnDefinition[] = [
	{
		slug: 'text',
		Component: ColumnText,
		config: columnTextConfig,
		label: 'Text Column',
		description: 'Display text values'
	},
	{
		slug: 'number',
		Component: ColumnNumber,
		config: columnNumberConfig,
		label: 'Number Column',
		description: 'Display numeric values with formatting'
	},
	{
		slug: 'date',
		Component: ColumnDate,
		config: columnDateConfig,
		label: 'Date Column',
		description: 'Display date/time values with formatting'
	},
	{
		slug: 'boolean',
		Component: ColumnBoolean,
		config: columnBooleanConfig,
		label: 'Boolean Column',
		description: 'Display boolean values as checkmarks'
	},
	{
		slug: 'badge',
		Component: ColumnBadge,
		config: columnBadgeConfig,
		label: 'Badge Column',
		description: 'Display values as colored badges'
	},
	{
		slug: 'json',
		Component: ColumnJson,
		config: columnJsonConfig,
		label: 'JSON Column',
		description: 'Display JSON data with syntax highlighting'
	}
]
