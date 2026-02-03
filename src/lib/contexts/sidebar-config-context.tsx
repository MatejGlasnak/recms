'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { SidebarConfig } from '@/lib/types/sidebar-config'
import { useSidebarConfigQuery } from '@/lib/hooks/use-sidebar-config'

interface SidebarConfigContextType {
	config: SidebarConfig | null
	isLoading: boolean
}

const SidebarConfigContext = createContext<SidebarConfigContextType | undefined>(undefined)

export function SidebarConfigProvider({ children }: { children: ReactNode }) {
	const { data, isLoading } = useSidebarConfigQuery()

	return (
		<SidebarConfigContext.Provider value={{ config: data ?? null, isLoading }}>
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
