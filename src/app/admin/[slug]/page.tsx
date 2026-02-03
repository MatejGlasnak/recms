'use client'

import { useList, useResourceParams } from '@refinedev/core'
import { use, useMemo, useState, useCallback, useEffect } from 'react'
import type React from 'react'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	type VisibilityState
} from '@tanstack/react-table'
import { ArrowUpDown, Settings2 } from 'lucide-react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationLink,
	PaginationEllipsis
} from '@/components/ui/pagination'
import { useListConfig } from '@/lib/hooks/use-list-config'
import { Pencil } from 'lucide-react'
import { AListPageTitle } from './_components/a-list-page-title'
import { AListPageDescription } from './_components/a-list-page-description'
import { AListFilters } from './_components/a-list-filters'
import { AListColumns } from './_components/a-list-columns'
import { Badge } from '@/components/ui/badge'
import type { ColumnConfig } from '@/lib/types/list-config'

export default function AdminListPage({ params }: { params: Promise<{ slug: string }> }) {
	// Unwrap params promise (Next.js 15+)
	const { slug } = use(params)

	// Get resource metadata
	const { resource } = useResourceParams({ resource: slug })

	// Fetch list configuration
	const { data: listConfig } = useListConfig(slug)

	// Edit mode state
	const [editMode, setEditMode] = useState(false)

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	// Server-side state
	const [filterValues, setFilterValues] = useState<Record<string, any>>({})
	const [sortField, setSortField] = useState<string>('')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

	// Build filters for the API
	const filters = useMemo(() => {
		const filterList: any[] = []
		const configuredFilters = listConfig?.filters || []

		// Add filters based on filter values
		Object.entries(filterValues).forEach(([field, value]) => {
			// Skip empty values
			if (value === undefined || value === null || value === '') {
				return
			}

			// Skip empty arrays (for multi-select combobox)
			if (Array.isArray(value) && value.length === 0) {
				return
			}

			// Find the filter configuration
			const filterConfig = configuredFilters.find(f => f.field === field)
			const operator = filterConfig?.operator || 'eq'

			// For checkbox filters, only add if true
			if (typeof value === 'boolean') {
				if (value) {
					filterList.push({
						field,
						operator,
						value: true
					})
				}
				return
			}

			// For array values (multi-select combobox), use 'in' operator
			if (Array.isArray(value)) {
				filterList.push({
					field,
					operator: filterConfig?.operator || 'in',
					value
				})
				return
			}

			// For text filters (including search)
			if (field === 'search') {
				filterList.push({
					field: 'search',
					operator: 'contains',
					value
				})
			} else {
				// For other filters, use configured operator
				filterList.push({
					field,
					operator,
					value
				})
			}
		})

		return filterList
	}, [filterValues, listConfig])

	// Build sorters for the API
	const sorters = useMemo(() => {
		if (!sortField) return []
		return [
			{
				field: sortField,
				order: sortOrder
			}
		]
	}, [sortField, sortOrder])

	// Fetch data using Refine's useList hook
	const listResult = useList({
		resource: slug,
		pagination: {
			current: currentPage,
			pageSize: pageSize
		} as any,
		sorters: sorters as any,
		filters: filters as any,
		dataProviderName: 'external',
		meta: {
			endpoint: resource?.meta?.endpoint
		}
	})

	const { result, query } = listResult

	const data = useMemo(() => result.data ?? [], [result.data])
	const total = result.total ?? 0
	const isLoading = query.isLoading
	const isError = query.isError

	// Table state (for UI only, not for server-side operations)
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	// Initialize column visibility based on configuration
	useEffect(() => {
		if (listConfig?.columns && listConfig.columns.length > 0) {
			const initialVisibility: VisibilityState = {}
			listConfig.columns.forEach(col => {
				initialVisibility[col.field] = col.enabledByDefault
			})
			setColumnVisibility(initialVisibility)
		}
	}, [listConfig?.columns])

	// Handle column header click for sorting
	const handleSort = useCallback(
		(columnId: string) => {
			if (sortField === columnId) {
				// Toggle sort order
				setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
			} else {
				// Set new sort field
				setSortField(columnId)
				setSortOrder('asc')
			}
			// Reset to first page when sorting changes
			setCurrentPage(1)
		},
		[sortField]
	)

	// Handle filter changes
	const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
		setFilterValues(newFilters)
		setCurrentPage(1) // Reset to first page when filters change
	}, [])

	// Generate columns based on configuration only
	const columns = useMemo<ColumnDef<any>[]>(() => {
		const configuredColumns = listConfig?.columns || []

		return configuredColumns.map(columnConfig => ({
			accessorKey: columnConfig.field,
			id: columnConfig.field, // Use field name as ID for TanStack Table
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
			cell: ({ row }) => {
				const value = row.getValue(columnConfig.field)
				return (
					<div
						className='truncate'
						style={{
							maxWidth: columnConfig.width ? `${columnConfig.width}px` : '300px'
						}}
					>
						{formatCellValueByType(value, columnConfig)}
					</div>
				)
			}
		}))
	}, [listConfig?.columns, sortField, sortOrder, handleSort])

	// Initialize table (for UI only, server handles pagination/sorting/filtering)
	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		pageCount: Math.ceil(total / pageSize),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			columnVisibility,
			rowSelection
		}
	})

	// Get default resource label from metadata
	const defaultResourceLabel = (resource?.meta?.label as string) || formatHeader(slug)
	const defaultResourceDescription = `Manage and view all ${defaultResourceLabel.toLowerCase()} in your system`

	// Loading state
	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-96'>
				<div className='text-muted-foreground'>Loading...</div>
			</div>
		)
	}

	// Error state
	if (isError) {
		return (
			<div className='flex items-center justify-center h-96'>
				<div className='text-destructive'>Something went wrong loading the data.</div>
			</div>
		)
	}

	return (
		<div className='container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6'>
			{/* Page Header with Actions */}
			<div className='flex items-start justify-between gap-4'>
				<div className='space-y-2 flex-1'>
					<AListPageTitle
						resourceId={slug}
						currentConfig={listConfig}
						editMode={editMode}
						defaultTitle={defaultResourceLabel}
					/>
					<AListPageDescription
						resourceId={slug}
						currentConfig={listConfig}
						editMode={editMode}
						defaultDescription={defaultResourceDescription}
					/>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant={editMode ? 'default' : 'outline'}
						size='sm'
						onClick={() => setEditMode(!editMode)}
					>
						<Pencil className='h-4 w-4 mr-2' />
						{editMode ? 'Done' : 'Edit'}
					</Button>
				</div>
			</div>

			{/* Table Controls */}
			<div className='flex items-center justify-between gap-4'>
				<div className='flex-1'>
					<AListFilters
						resourceId={slug}
						currentConfig={listConfig}
						editMode={editMode}
						filters={filterValues}
						onFilterChange={handleFilterChange}
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' size='sm' className='ml-auto h-8'>
							<Settings2 className='mr-2 h-4 w-4' />
							Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-[150px]'>
						<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => {
								const configuredColumn = listConfig?.columns?.find(
									c => c.field === column.id
								)
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={value => column.toggleVisibility(!!value)}
									>
										{configuredColumn?.label || column.id}
									</DropdownMenuCheckboxItem>
								)
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Data Table */}
			<AListColumns resourceId={slug} currentConfig={listConfig} editMode={editMode}>
				{columns.length === 0 ? (
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
										{headerGroup.headers.map(header => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext()
														  )}
												</TableHead>
											)
										})}
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
										<TableCell
											colSpan={columns.length}
											className='h-24 text-center'
										>
											No results found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				)}
			</AListColumns>

			{/* Pagination Controls */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2'>
				<div className='flex-1 text-sm text-muted-foreground'>
					Showing {Math.min((currentPage - 1) * pageSize + 1, total)} to{' '}
					{Math.min(currentPage * pageSize, total)} of {total} results
				</div>
				<div className='flex items-center gap-6 lg:gap-8'>
					<div className='flex items-center gap-2'>
						<p className='text-sm font-medium whitespace-nowrap'>Rows per page</p>
						<Select
							value={`${pageSize}`}
							onValueChange={value => {
								setPageSize(Number(value))
								setCurrentPage(1)
							}}
						>
							<SelectTrigger className='h-8 w-[70px]'>
								<SelectValue placeholder={pageSize} />
							</SelectTrigger>
							<SelectContent side='top'>
								{[10, 20, 30, 50, 100].map(size => (
									<SelectItem key={size} value={`${size}`}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href='#'
									onClick={(e: React.MouseEvent) => {
										e.preventDefault()
										if (currentPage > 1) setCurrentPage(prev => prev - 1)
									}}
								/>
							</PaginationItem>
							{getPageNumbers(currentPage, Math.ceil(total / pageSize)).map(
								(page, idx) => {
									if (page === '...') {
										return (
											<PaginationItem key={`ellipsis-${idx}`}>
												<PaginationEllipsis />
											</PaginationItem>
										)
									}
									return (
										<PaginationItem key={page}>
											<PaginationLink
												href='#'
												isActive={page === currentPage}
												onClick={(e: React.MouseEvent) => {
													e.preventDefault()
													setCurrentPage(page as number)
												}}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									)
								}
							)}
							<PaginationItem>
								<PaginationNext
									href='#'
									onClick={(e: React.MouseEvent) => {
										e.preventDefault()
										if (currentPage < Math.ceil(total / pageSize)) {
											setCurrentPage(prev => prev + 1)
										}
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	)
}

// Helper functions
// Helper functions
function formatHeader(key: string): string {
	return key
		.replace(/([A-Z])/g, ' $1')
		.replace(/_/g, ' ')
		.replace(/^./, str => str.toUpperCase())
		.trim()
}

function formatCellValueByType(value: any, columnConfig: ColumnConfig): React.ReactNode {
	if (value === null || value === undefined) return '-'

	switch (columnConfig.type) {
		case 'text':
			return String(value)

		case 'number':
			if (typeof value === 'number') {
				return columnConfig.format
					? new Intl.NumberFormat('en-US', {
							...(columnConfig.format.includes('currency')
								? { style: 'currency', currency: 'USD' }
								: {})
					  }).format(value)
					: value.toLocaleString()
			}
			return String(value)

		case 'date':
			if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
				const date = new Date(value)
				return columnConfig.format === 'datetime'
					? date.toLocaleString()
					: date.toLocaleDateString()
			}
			return String(value)

		case 'boolean':
			return typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)

		case 'badge':
			return <Badge variant={columnConfig.badgeVariant || 'default'}>{String(value)}</Badge>

		case 'json':
			if (typeof value === 'object') {
				return (
					<code className='text-xs bg-muted px-2 py-1 rounded'>
						{JSON.stringify(value, null, 2)}
					</code>
				)
			}
			return String(value)

		default:
			return String(value)
	}
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
	const pages: (number | string)[] = []
	const maxVisiblePages = 5

	if (totalPages <= maxVisiblePages) {
		// Show all pages if total is less than max visible
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i)
		}
	} else {
		// Always show first page
		pages.push(1)

		if (currentPage > 3) {
			pages.push('...')
		}

		// Show pages around current page
		const start = Math.max(2, currentPage - 1)
		const end = Math.min(totalPages - 1, currentPage + 1)

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		if (currentPage < totalPages - 2) {
			pages.push('...')
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages)
		}
	}

	return pages
}
