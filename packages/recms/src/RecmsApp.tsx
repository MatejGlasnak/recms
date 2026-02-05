'use client'

import type { ReactNode } from 'react'
import { RecmsProvider } from '@blume/recms-core'
import type { RecmsConfig } from '@blume/recms-core'
import { builtInBlocks } from '@blume/recms-ui'
import { builtInColumns } from '@blume/recms-ui'
import { builtInFilters } from '@blume/recms-ui'
import { builtInFields } from '@blume/recms-ui'

export interface RecmsAppProps {
	/** ReCMS configuration */
	config?: Partial<RecmsConfig>
	/** Child components */
	children: ReactNode
}

/**
 * Main ReCMS application wrapper
 *
 * Provides all necessary context providers for ReCMS to work.
 * This is a convenience component that wraps RecmsProvider with sensible defaults
 * and automatically registers all built-in blocks, columns, filters, and fields.
 *
 * @example
 * ```tsx
 * import { RecmsApp } from '@blume/recms'
 *
 * export function Providers({ children }) {
 *   return (
 *     <RecmsApp config={recmsConfig}>
 *       <RefineProvider>
 *         {children}
 *       </RefineProvider>
 *     </RecmsApp>
 *   )
 * }
 * ```
 */
export function RecmsApp({ config, children }: RecmsAppProps) {
	return (
		<RecmsProvider 
			config={config}
			builtInBlocks={builtInBlocks}
			builtInColumns={builtInColumns}
			builtInFilters={builtInFilters}
			builtInFields={builtInFields}
		>
			{children}
		</RecmsProvider>
	)
}
