'use client'

import { useParams, useRouter } from 'next/navigation'
import { useOne, useResourceParams } from '@refinedev/core'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { usePageSetup } from '@/lib/contexts/page-context'
import { useListConfig, useShowConfig } from '../../hooks'
import { formatHeader } from '../../utils'
import type { ShowGroup, ShowItem, ShowTab } from '../../types/show-config'
import { ShowPageLayout } from '../../components/show/ShowPageLayout'
import { ShowFieldValue } from '../../components/show/ShowFieldValue'
import { ShowPageTabs } from '../../components/show/ShowPageTabs'
import { ShowTabContent } from '../../components/show/ShowTabContent'

export interface ShowPageContainerProps {
	resourceId?: string
	id?: string
}

function normalizeTabValue(label: string, index: number): string {
	return `tab-${index}-${label.toLowerCase().replace(/\s+/g, '-')}`
}

/** Flatten columnItems to a row-major list for layout; each item gets colspan 1 if not set. */
function getGroupItems(group: ShowGroup): ShowItem[] {
	if (group.items && group.items.length > 0) {
		return group.items
	}
	const columnItems = group.columnItems ?? []
	const columns = group.columns ?? 1
	if (columns <= 0 || columnItems.length === 0) return []
	const maxRows = Math.max(...columnItems.map(col => col.length))
	const flat: ShowItem[] = []
	for (let row = 0; row < maxRows; row++) {
		for (let col = 0; col < columns; col++) {
			const item = columnItems[col]?.[row]
			if (item) flat.push(item)
		}
	}
	return flat
}

function ShowGroupBlock({
	group,
	record
}: {
	group: ShowGroup
	record: Record<string, unknown> | null
}) {
	const columns = group.columns ?? 1
	const items = getGroupItems(group)
	const groupLabel = group.label ?? group.name

	return (
		<div className='space-y-3'>
			{(groupLabel || group.description) && (
				<div className='space-y-1'>
					{groupLabel && (
						<h4 className='text-sm font-medium leading-none text-foreground'>
							{groupLabel}
						</h4>
					)}
					{group.description && (
						<p className='text-sm text-muted-foreground'>{group.description}</p>
					)}
				</div>
			)}
			<div
				className='grid gap-6'
				style={{
					gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
				}}
			>
				{items.map((item, itemIndex) => {
					const value = record ? record[item.field] : undefined
					const label = item.label ?? item.field
					const span = Math.min(columns, Math.max(1, item.colspan ?? 1))
					return (
						<div
							key={`${item.field}-${itemIndex}`}
							className='grid gap-1.5 border-b border-border pb-4 last:border-0 last:pb-0'
							style={{ gridColumn: `span ${span}` }}
						>
							<dt className='text-sm font-medium text-muted-foreground'>{label}</dt>
							<dd className='text-sm'>
								<ShowFieldValue value={value} item={item} />
							</dd>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export function ShowPage({ resourceId: resourceIdProp, id: idProp }: ShowPageContainerProps) {
	const params = useParams()
	const router = useRouter()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''
	const id = idProp ?? (params?.id as string) ?? ''
	const { resource } = useResourceParams({ resource: resourceId })
	const { data: listConfig, isLoading: isListConfigLoading } = useListConfig(resourceId)
	const { data: showConfig, isLoading: isShowConfigLoading } = useShowConfig(resourceId)
	const isConfigLoading = isListConfigLoading || isShowConfigLoading

	const [editMode, setEditMode] = useState(false)
	const [tabEditorOpen, setTabEditorOpen] = useState(false)

	const { result, query } = useOne({
		resource: resourceId,
		id,
		dataProviderName: 'external',
		meta: { endpoint: resource?.meta?.endpoint }
	})

	const record = (result?.data as Record<string, unknown>) ?? null
	const isLoading = query.isLoading
	const isError = query.isError

	const resourceLabel = (resource?.meta?.label as string) || formatHeader(resourceId)
	const pageTitle = `${resourceLabel}${id ? ` #${id}` : ''}`
	const pageDescription = `View details of this ${resourceLabel.toLowerCase()}.`
	usePageSetup(pageTitle, [
		{ label: 'Resources' },
		{ label: resourceLabel, href: `/admin/resources/${resourceId}` },
		...(id ? [{ label: `#${id}` }] : [])
	])

	const tabs = useMemo(() => showConfig?.tabs ?? [], [showConfig?.tabs])
	const hasTabs = tabs.length > 0

	const placeholderTab: ShowTab = useMemo(
		() => ({
			label: 'No tabs configured',
			showLabel: '',
			description: undefined,
			groups: []
		}),
		[]
	)

	// When no tabs: in edit mode show one placeholder tab so user can click and create first tab
	const displayTabs = useMemo(
		(): ShowTab[] => (hasTabs ? tabs : editMode ? [placeholderTab] : []),
		[hasTabs, tabs, editMode, placeholderTab]
	)
	const showTabsUI = displayTabs.length > 0
	const defaultTab = showTabsUI ? normalizeTabValue(displayTabs[0].label, 0) : undefined
	const placeholderTabIndex = !hasTabs && editMode ? 0 : null

	if (isConfigLoading) {
		return (
			<div
				className='container w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[min(24rem,60vh)]'
				style={{ paddingTop: '24px' }}
			>
				<Spinner className='size-6 mb-2' />
				<p className='text-sm text-muted-foreground'>
					{isConfigLoading ? 'Loading page configuration…' : 'Loading data…'}
				</p>
			</div>
		)
	}

	return (
		<ShowPageLayout
			resourceId={resourceId}
			resourceMeta={{ label: resourceLabel }}
			defaultTitle={pageTitle}
			defaultDescription={pageDescription}
			isLoading={isLoading}
			isError={isError}
			editMode={editMode}
			onEditModeToggle={() => setEditMode(prev => !prev)}
			onBack={() => router.push(`/admin/resources/${resourceId}`)}
		>
			{!showTabsUI ? (
				<ShowTabContent
					resourceId={resourceId}
					listConfig={listConfig ?? undefined}
					showConfig={showConfig ?? undefined}
					editMode={editMode}
					empty
					hasTabs={false}
					tabIndex={0}
					tabEditorOpen={tabEditorOpen}
					onTabEditorOpenChange={setTabEditorOpen}
					onOpenTabEditor={() => setTabEditorOpen(true)}
				>
					{null}
				</ShowTabContent>
			) : (
				<Tabs
					key={tabs.map(t => t.label).join(',')}
					defaultValue={defaultTab}
					className='w-full space-y-4'
				>
					<ShowPageTabs
						resourceId={resourceId}
						showConfig={showConfig ?? undefined}
						editMode={editMode}
						tabs={displayTabs}
						normalizeTabValue={normalizeTabValue}
						placeholderTabIndex={placeholderTabIndex}
						tabEditorOpen={tabEditorOpen}
						onTabEditorOpenChange={setTabEditorOpen}
					/>
					{displayTabs.map((tab, index) => (
						<TabsContent
							key={normalizeTabValue(tab.label, index)}
							value={normalizeTabValue(tab.label, index)}
							className='mt-0'
						>
							<ShowTabContent
								resourceId={resourceId}
								listConfig={listConfig ?? undefined}
								showConfig={showConfig ?? undefined}
								editMode={editMode}
								empty={!(tab.groups && tab.groups.length > 0)}
								hasTabs={hasTabs}
								tabIndex={hasTabs ? index : 0}
								tabEditorOpen={tabEditorOpen}
								onTabEditorOpenChange={setTabEditorOpen}
								onOpenTabEditor={() => setTabEditorOpen(true)}
							>
								<Card>
									<CardHeader className='space-y-1.5'>
										{(tab.showLabel ?? tab.label) && (
											<CardTitle className='text-lg'>
												{tab.showLabel ?? tab.label}
											</CardTitle>
										)}
										{tab.description && (
											<CardDescription>{tab.description}</CardDescription>
										)}
									</CardHeader>
									<CardContent className='space-y-8'>
										{(tab.groups ?? []).map((group, groupIndex) => (
											<ShowGroupBlock
												key={groupIndex}
												group={group}
												record={record}
											/>
										))}
									</CardContent>
								</Card>
							</ShowTabContent>
						</TabsContent>
					))}
				</Tabs>
			)}
		</ShowPageLayout>
	)
}
