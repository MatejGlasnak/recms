'use client'

import { Refine } from '@refinedev/core'
import routerProvider from '@refinedev/nextjs-router'
import { internalDataProvider } from '@/lib/refine/data-provider-internal'
import { externalDataProvider } from '@/lib/refine/data-provider-external'
import { useRefineResources } from '@/lib/hooks/use-refine-resources'
import { ReactNode } from 'react'

interface RefineProviderProps {
	children: ReactNode
}

export function RefineProvider({ children }: RefineProviderProps) {
	const resources = useRefineResources()

	return (
		<Refine
			routerProvider={routerProvider}
			dataProvider={{
				default: internalDataProvider,
				external: externalDataProvider
			}}
			resources={resources}
			options={{
				syncWithLocation: true,
				warnWhenUnsavedChanges: true,
				disableTelemetry: true
			}}
		>
			{children}
		</Refine>
	)
}
