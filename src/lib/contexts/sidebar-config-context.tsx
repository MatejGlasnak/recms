'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { SidebarConfig } from '@/lib/types/sidebar-config'

interface SidebarConfigContextType {
	config: SidebarConfig
	setConfig: (config: SidebarConfig) => void
}

const SidebarConfigContext = createContext<SidebarConfigContextType | undefined>(undefined)

const defaultConfig: SidebarConfig = {
	groups: [
		{
			id: 'group-main',
			title: undefined,
			items: []
		},
		{
			id: 'group-documents',
			title: 'Documents',
			maxItems: 3,
			items: []
		}
	]
}

export function SidebarConfigProvider({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState<SidebarConfig>(defaultConfig)

	return (
		<SidebarConfigContext.Provider value={{ config, setConfig }}>
			{children}
		</SidebarConfigContext.Provider>
	)
}

export function useSidebarConfig() {
	const context = useContext(SidebarConfigContext)
	if (!context) {
		throw new Error('useSidebarConfig must be used within a SidebarConfigProvider')
	}
	return context
}
