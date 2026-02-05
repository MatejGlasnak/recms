'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { RecmsConfig } from './types'
import { mergeWithDefaults } from './loader'

interface RecmsConfigContextValue {
	config: RecmsConfig
}

const RecmsConfigContext = createContext<RecmsConfigContextValue | null>(null)

export interface RecmsConfigProviderProps {
	children: ReactNode
	config?: Partial<RecmsConfig>
}

export function RecmsConfigProvider({ children, config: userConfig }: RecmsConfigProviderProps) {
	const config = useMemo(() => mergeWithDefaults(userConfig), [userConfig])

	const value = useMemo(
		() => ({
			config
		}),
		[config]
	)

	return <RecmsConfigContext.Provider value={value}>{children}</RecmsConfigContext.Provider>
}

export function useRecmsConfig() {
	const context = useContext(RecmsConfigContext)
	if (!context) {
		throw new Error('useRecmsConfig must be used within RecmsConfigProvider')
	}
	return context.config
}
