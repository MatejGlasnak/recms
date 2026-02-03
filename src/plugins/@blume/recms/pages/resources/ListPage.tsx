'use client'

import { useParams } from 'next/navigation'
import { useList, useResourceParams } from '@refinedev/core'
import { useMemo, useState, useCallback, useEffect } from 'react'
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
import { useListConfig } from '../../hooks'
import { buildListFilters } from '../../utils'
import { ColumnCell } from '../../components/list/columns/ColumnCell'
import { ListPageLayout } from '../../components/list/ListPageLayout'

export interface ListPageContainerProps {
	resourceId?: string
}

export function ListPage({ resourceId: resourceIdProp }: ListPageContainerProps) {
	const params = useParams()
	const resourceId = resourceIdProp ?? (params?.slug as string) ?? ''
	const { resource } = useResourceParams({ resource: resourceId })
	console.log('resource', resource)
	const { data: listConfig } = useListConfig(resourceId)

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
		meta: { endpoint: resource?.meta?.endpoint }
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
			<div className='overflow-hidden rounded-md border'>
				<div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
					<div className='max-w-md space-y-2'>
						<h3 className='text-lg font-semibold'>No Columns Configured</h3>
						<p className='text-sm text-muted-foreground'>
							{editMode
								? 'Click here to add and configure columns.'
								: 'Enable Edit mode to configure columns.'}
						</p>
					</div>
				</div>
			</div>
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

	return (
		<ListPageLayout
			resourceId={resourceId}
			resourceMeta={{ label: resource?.meta?.label as string }}
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
			isLoading={isLoading}
			isError={isError}
		>
			{tableContent}
		</ListPageLayout>
	)
}
