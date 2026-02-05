import type { RecmsConfig } from './types'
import { defaultConfig } from './default'

/**
 * Merges user config with defaults
 */
export function mergeWithDefaults(userConfig?: Partial<RecmsConfig>): RecmsConfig {
	if (!userConfig) {
		return defaultConfig
	}

	return {
		api: {
			...defaultConfig.api,
			...userConfig.api
		},
		blocks: userConfig.blocks || defaultConfig.blocks,
		columns: userConfig.columns || defaultConfig.columns,
		filters: userConfig.filters || defaultConfig.filters,
		fields: userConfig.fields || defaultConfig.fields,
		features: {
			...defaultConfig.features,
			...userConfig.features
		}
	}
}

/**
 * Loads ReCMS configuration
 * Configuration is provided via RecmsProvider, not loaded from file
 */
export function loadRecmsConfig(config?: Partial<RecmsConfig>): RecmsConfig {
	return mergeWithDefaults(config)
}
