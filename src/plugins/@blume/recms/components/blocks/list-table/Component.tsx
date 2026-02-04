'use client'

import { useMemo, useState, useCallback } from 'react'
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type VisibilityState
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { useNavigation } from '@refinedev/core'
import { ColumnText } from '../../columns/column-text'
import { ColumnNumber } from '../../columns/column-number'
import { ColumnDate } from '../../columns/column-date'
import { ColumnBoolean } from '../../columns/column-boolean'
import { ColumnBadge } from '../../columns/column-badge'
import { ColumnJson } from '../../columns/column-json'
import type { BlockComponentProps } from '../../registry'
import type { ColumnConfig } from '../../../types/block-config'
import { FormModal } from '../../form/FormModal'
import { listTableConfig } from './config'

interface ColumnCellProps {
	value: unknown
	columnConfig: ColumnConfig
}

function ColumnCell({ value, columnConfig }: ColumnCellProps) {
	switch (columnConfig.type) {
		case 'text':
			return <ColumnText value={value} />
		case 'number':
			return <ColumnNumber value={value} format={columnConfig.format} />
		case 'date':
			return <ColumnDate value={value} format={columnConfig.format} />
		case 'boolean':
			return <ColumnBoolean value={value} />
		case 'badge':
			return <ColumnBadge value={value} variant={columnConfig.badgeVariant} />
		case 'json':
			return <ColumnJson value={value} />
		default:
			return <>{String(value)}</>
	}
}

export function ListTable({
	blockConfig,
	data = [],
	isLoading,
	editMode,
	onConfigUpdate,
	onDelete,
	sortField: externalSortField,
	sortOrder: externalSortOrder,
	onSort: externalOnSort,
	resourceId
}: BlockComponentProps) {
	const [showSettings, setShowSettings] = useState(false)
	const [localSortField, setLocalSortField] = useState<string>('')
	const [localSortOrder, setLocalSortOrder] = useState<'asc' | 'desc'>('desc')
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const { edit: goToEdit, show: goToShow } = useNavigation()

	// Use external sort state if provided
	const sortField = externalSortField ? (externalSortField as string) : localSortField
	const sortOrder = externalSortOrder ? (externalSortOrder as 'asc' | 'desc') : localSortOrder
	const handleSort = externalOnSort
		? (externalOnSort as (field: string) => void)
		: (field: string) => {
				if (localSortField === field) {
					setLocalSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
				} else {
					setLocalSortField(field)
					setLocalSortOrder('asc')
				}
		  }

	const config = blockConfig.config as {
		columns?: ColumnConfig[]
		rowClickAction?: 'show' | 'edit' | 'none'
	}

	// Helper to get record ID
	const getRecordId = useCallback((record: unknown): string | null => {
		if (record == null || typeof record !== 'object') return null
		const r = record as Record<string, unknown>
		const id = r.id ?? r._id
		if (id == null) return null
		return String(id)
	}, [])

	// Handle row click
	const handleRowClick = useCallback(
		(record: unknown) => {
			if (!resourceId || editMode) return
			const rowClickAction = config.rowClickAction ?? 'none'
			if (rowClickAction === 'none') return

			const id = getRecordId(record)
			if (!id) return

			if (rowClickAction === 'edit') {
				goToEdit(resourceId, id)
			} else if (rowClickAction === 'show') {
				goToShow(resourceId, id)
			}
		},
		[resourceId, config.rowClickAction, goToEdit, goToShow, getRecordId, editMode]
	)

	// Sample columns for edit mode when no columns configured
	const sampleColumns = useMemo<ColumnDef<unknown>[]>(() => {
		return [
			{
				accessorKey: 'id',
				id: 'id',
				header: () => <span className='font-medium'>ID</span>,
				cell: () => <span>1</span>
			},
			{
				accessorKey: 'title',
				id: 'title',
				header: () => <span className='font-medium'>Title</span>,
				cell: () => <span>Sample Row</span>
			}
		]
	}, [])

	const columns = useMemo<ColumnDef<unknown>[]>(() => {
		const configuredColumns = config.columns ?? []
		if (configuredColumns.length === 0 && editMode) {
			return sampleColumns
		}
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
	}, [config.columns, sortField, sortOrder, editMode, sampleColumns, handleSort])

	// Sample data for edit mode when no columns configured
	const sampleData = useMemo(() => [{ id: 1, title: 'Sample Row' }], [])
	const tableData = config.columns?.length === 0 && editMode ? sampleData : (data as unknown[])

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		onColumnVisibilityChange: setColumnVisibility,
		state: { columnVisibility }
	})

	const handleSaveSettings = async (values: Record<string, unknown>) => {
		if (onConfigUpdate) {
			await onConfigUpdate(blockConfig.id, values)
		}
		setShowSettings(false)
	}

	const handleDelete = async () => {
		if (onDelete && typeof onDelete === 'function') {
			await onDelete()
		}
	}

	if (columns.length === 0 && !editMode) {
		return (
			<div className='text-center py-12 text-muted-foreground'>
				<p>No columns configured</p>
			</div>
		)
	}

	const showSampleData = config.columns?.length === 0 && editMode

	return (
		<>
			<div
				className={`relative ${
					editMode
						? 'p-3 border border-dashed border-primary/40 hover:border-primary hover:border-solid rounded-lg cursor-pointer'
						: ''
				}`}
				onClick={editMode ? () => setShowSettings(true) : undefined}
			>
				<div
					className={`overflow-hidden rounded-md border ${
						showSampleData ? 'opacity-50' : ''
					}`}
				>
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
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center text-muted-foreground'
									>
										<Spinner className='mx-auto' />
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map(row => (
									<TableRow
										key={row.id}
										onClick={() => handleRowClick(row.original)}
										className={
											config.rowClickAction !== 'none' && !editMode
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
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center text-muted-foreground'
									>
										No results found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<FormModal
				open={showSettings}
				onOpenChange={setShowSettings}
				title='Table Settings'
				description='Configure the list table columns and behavior'
				fieldConfig={listTableConfig}
				initialValues={config}
				onSubmit={handleSaveSettings}
				onDelete={onDelete ? handleDelete : undefined}
			/>
		</>
	)
}
