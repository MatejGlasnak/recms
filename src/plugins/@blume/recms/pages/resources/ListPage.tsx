'use client'

import { useParams } from 'next/navigation'
import { useList, useResourceParams, useNavigation } from '@refinedev/core'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { usePageSetup } from '@/lib/contexts/page-context'
import { useResources } from '@/lib/hooks/use-resources'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	type VisibilityState
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useListConfig } from '../../hooks'
import { buildListFilters, formatHeader } from '../../utils'
import { ColumnCell } from '../../components/list/columns/ColumnCell'
import { ConfigEmptyState } from '../../components/ui/ConfigEmptyState'
import { ListPageLayout } from '../../components/list/ListPageLayout'

export interface ListPageContainerProps {
	resourceId?: string
}

export function ListPage({ resourceId: resourceIdProp }: ListPageContainerProps) {
	const params = useParams()
	const resourceId = resourceIdProp ?? (params?.resourceName as string) ?? ''

	const { data: resources = [], isLoading: isResourcesLoading } = useResources()
	const resourceDef = useMemo(
		() => resources.find(r => r.name === resourceId),
		[resources, resourceId]
	)

	const { resource } = useResourceParams({ resource: resourceId })
	const { data: listConfig, isLoading: isConfigLoading } = useListConfig(resourceId)
	const { edit: goToEdit, show: goToShow } = useNavigation()

	// Use resource definition (label/endpoint) so breadcrumb and API use correct values
	// before Refine's resource params are populated (avoids brief "Blog-Post" and wrong /blog-posts call)
	const resourceLabel =
		resourceDef?.label ??
		(resource?.meta?.label as string) ??
		(isResourcesLoading ? 'Loading…' : formatHeader(resourceId))
	const isResourceLabelLoading = resourceLabel === 'Loading…'
	usePageSetup(resourceLabel, [
		{ label: 'Resources' },
		{ label: resourceLabel, muted: isResourceLabelLoading }
	])

	const rowClickAction = listConfig?.rowClickAction ?? 'none'

	const getRecordId = useCallback((record: unknown): string | null => {
		if (record == null || typeof record !== 'object') return null
		const r = record as Record<string, unknown>
		const id = r.id ?? r._id
		if (id == null) return null
		return String(id)
	}, [])

	const handleRowClick = useCallback(
		(record: unknown) => {
			if (rowClickAction === 'none') return
			const id = getRecordId(record)
			if (!id) return
			if (rowClickAction === 'edit') {
				goToEdit(resourceId, id)
			} else if (rowClickAction === 'show') {
				goToShow(resourceId, id)
			}
		},
		[rowClickAction, resourceId, goToEdit, goToShow, getRecordId]
	)

	const [editMode, setEditMode] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [filterValues, setFilterValues] = useState<Record<string, unknown>>({})
	const [sortField, setSortField] = useState<string>('')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const filters = useMemo(
		() => buildListFilters(filterValues, listConfig ?? undefined),
		[filterValues, listConfig]
	)

	const sorters = useMemo(() => {
		if (!sortField) return []
		return [{ field: sortField, order: sortOrder }]
	}, [sortField, sortOrder])

	const listResult = useList({
		resource: resourceId,
		pagination: { current: currentPage, pageSize } as any,
		sorters: sorters as any,
		filters: filters as any,
		dataProviderName: 'external',
		meta: { endpoint: resourceDef?.endpoint ?? resource?.meta?.endpoint },
		queryOptions: {
			// Avoid wrong API call (e.g. /api/external/blog-posts) until we have the correct endpoint
			enabled: !!(resourceDef?.endpoint ?? resource?.meta?.endpoint)
		}
	})

	const { result, query } = listResult
	const data = useMemo(() => result.data ?? [], [result.data])
	const total = result.total ?? 0
	const isLoading = query.isLoading
	const isError = query.isError

	useEffect(() => {
		if (listConfig?.columns && listConfig.columns.length > 0) {
			const initialVisibility: VisibilityState = {}
			listConfig.columns.forEach(col => {
				initialVisibility[col.field] = col.enabledByDefault
			})
			setColumnVisibility(initialVisibility)
		}
	}, [listConfig?.columns])

	const handleSort = useCallback(
		(columnId: string) => {
			if (sortField === columnId) {
				setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
			} else {
				setSortField(columnId)
				setSortOrder('asc')
			}
			setCurrentPage(1)
		},
		[sortField]
	)

	const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
		setFilterValues(newFilters)
		setCurrentPage(1)
	}, [])

	const handleColumnVisibilityChange = useCallback((field: string, visible: boolean) => {
		setColumnVisibility(prev => ({ ...prev, [field]: visible }))
	}, [])

	const columns = useMemo<ColumnDef<unknown>[]>(() => {
		const configuredColumns = listConfig?.columns ?? []
		return configuredColumns.map(columnConfig => ({
			accessorKey: columnConfig.field,
			id: columnConfig.field,
			header: () => (
				<Button
					variant='ghost'
					size='sm'
					className='-ml-3 h-8'
					onClick={() => columnConfig.sortable && handleSort(columnConfig.field)}
					disabled={!columnConfig.sortable}
				>
					{columnConfig.label}
					{columnConfig.sortable && <ArrowUpDown className='ml-2 h-4 w-4' />}
					{sortField === columnConfig.field && (
						<span className='ml-1 text-xs'>{sortOrder === 'asc' ? '↑' : '↓'}</span>
					)}
				</Button>
			),
			cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
				const value = row.getValue(columnConfig.field)
				return (
					<div
						className='truncate'
						style={{
							maxWidth: columnConfig.width ? `${columnConfig.width}px` : '300px'
						}}
					>
						<ColumnCell value={value} columnConfig={columnConfig} />
					</div>
				)
			}
		}))
	}, [listConfig?.columns, sortField, sortOrder, handleSort])

	// TanStack Table's useReactTable() uses interior mutability; React Compiler skips this component.
	// We only use `table` in this component for rendering—never pass it to memoized children.
	// eslint-disable-next-line react-hooks/incompatible-library -- useReactTable is a known incompatible API; safe here.
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		pageCount: Math.ceil(total / pageSize),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: { columnVisibility, rowSelection }
	})

	const tableContent =
		columns.length === 0 ? (
			<ConfigEmptyState
				title='No Columns Configured'
				description={
					editMode
						? 'Click here to add and configure columns.'
						: 'Enable Edit mode to configure columns.'
				}
			/>
		) : (
			<div className='overflow-hidden rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									onClick={
										rowClickAction !== 'none'
											? () => handleRowClick(row.original)
											: undefined
									}
									className={
										rowClickAction !== 'none'
											? 'cursor-pointer hover:bg-muted/50'
											: undefined
									}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									No results found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		)

	// Wait for resources, config, and list data so we don't show table until ready
	if (isConfigLoading || (resourceId && isResourcesLoading) || isLoading) {
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
		<ListPageLayout
			resourceId={resourceId}
			resourceMeta={{ label: resourceLabel }}
			listConfig={listConfig ?? undefined}
			editMode={editMode}
			onEditModeToggle={() => setEditMode(prev => !prev)}
			filterValues={filterValues}
			onFilterChange={handleFilterChange}
			columnVisibility={columnVisibility}
			onColumnVisibilityChange={handleColumnVisibilityChange}
			currentPage={currentPage}
			pageSize={pageSize}
			onPageChange={setCurrentPage}
			onPageSizeChange={setPageSize}
			total={total}
			isError={isError}
			errorMessage={query.error instanceof Error ? query.error.message : undefined}
		>
			{tableContent}
		</ListPageLayout>
	)
}
