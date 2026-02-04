import type { RecmsConfig } from './types'
import { defaultConfig } from './default'

/**
 * Deep merge two objects
 */
function mergeConfig(defaults: RecmsConfig, user: Partial<RecmsConfig>): RecmsConfig {
	return {
		api: {
			...defaults.api,
			...user.api
		},
		blocks: user.blocks ?? defaults.blocks,
		columns: user.columns ?? defaults.columns,
		filters: user.filters ?? defaults.filters,
		fields: user.fields ?? defaults.fields,
		features: {
			...defaults.features,
			...user.features
		}
	}
}

/**
 * Load ReCMS configuration from project root
 * Falls back to default config if not found
 */
export async function loadRecmsConfig(): Promise<RecmsConfig> {
	try {
		// Try to dynamically import config from project root
		const userConfig = await import('@/recms.config')
		return mergeConfig(defaultConfig, userConfig.default || {})
	} catch {
		// No config found or import failed, use defaults
		return defaultConfig
	}
}

/**
 * Merge user config with defaults (synchronous version for provider)
 */
export function mergeWithDefaults(userConfig?: Partial<RecmsConfig>): RecmsConfig {
	if (!userConfig) {
		return defaultConfig
	}
	return mergeConfig(defaultConfig, userConfig)
}
