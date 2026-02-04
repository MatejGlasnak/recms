'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'

export interface BreadcrumbItem {
	label: string
	href?: string
	/** When true, render with muted (less visible) styling */
	muted?: boolean
}

interface PageContextType {
	title: string
	setTitle: (title: string) => void
	breadcrumbs: BreadcrumbItem[]
	setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: ReactNode }) {
	const [title, setTitle] = useState('')
	const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

	return (
		<PageContext.Provider value={{ title, setTitle, breadcrumbs, setBreadcrumbs }}>
			{children}
		</PageContext.Provider>
	)
}

export function usePage() {
	const context = useContext(PageContext)
	if (!context) {
		throw new Error('usePage must be used within a PageProvider')
	}
	return context
}

export function usePageSetup(title: string, breadcrumbs: BreadcrumbItem[]) {
	const { setTitle, setBreadcrumbs } = usePage()
	const prevTitleRef = useRef<string | undefined>(undefined)
	const prevBreadcrumbsRef = useRef<string | undefined>(undefined)

	useEffect(() => {
		// Only update if the values have actually changed
		const breadcrumbsStr = JSON.stringify(breadcrumbs)

		if (prevTitleRef.current !== title) {
			setTitle(title)
			prevTitleRef.current = title
		}

		if (prevBreadcrumbsRef.current !== breadcrumbsStr) {
			setBreadcrumbs(breadcrumbs)
			prevBreadcrumbsRef.current = breadcrumbsStr
		}
	})
}
