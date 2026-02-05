import type { ReactNode } from 'react'
import type { RecmsConfig } from '@blume/recms-core'

/**
 * Props for RecmsApp component
 */
export interface RecmsAppProps {
	/** ReCMS configuration */
	config?: Partial<RecmsConfig>
	/** Child components */
	children: ReactNode
}
