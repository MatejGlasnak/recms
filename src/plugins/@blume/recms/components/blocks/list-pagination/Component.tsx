'use client'

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/components/ui/pagination'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import type { BlockComponentProps } from '../../registry'
import { useState } from 'react'
import { FormModal } from '../../form/FormModal'
import { listPaginationConfig } from './config'
import { Field, FieldLabel } from '@/components/ui/field'

export function ListPagination({
	blockConfig,
	editMode,
	onConfigUpdate,
	onDelete,
	currentPage: externalCurrentPage,
	pageSize: externalPageSize,
	total: externalTotal,
	onPageChange: externalOnPageChange,
	onPageSizeChange: externalOnPageSizeChange
}: BlockComponentProps) {
	const [showSettings, setShowSettings] = useState(false)
	const [localCurrentPage, setLocalCurrentPage] = useState(1)
	const [localPageSize, setLocalPageSize] = useState(10)

	const config = blockConfig.config as {
		pageSize?: number
		pageSizeOptions?: string | number[]
	}

	// Parse pageSizeOptions from string or array
	const pageSizeOptions = (() => {
		if (!config.pageSizeOptions) return [10, 25, 50, 100]
		if (Array.isArray(config.pageSizeOptions)) return config.pageSizeOptions
		// Parse comma-separated string
		return config.pageSizeOptions
			.split(',')
			.map(s => parseInt(s.trim(), 10))
			.filter(n => !isNaN(n))
	})()

	// Use external values if provided
	const currentPage = externalCurrentPage ? (externalCurrentPage as number) : localCurrentPage
	const pageSize = externalPageSize ? (externalPageSize as number) : localPageSize
	const total = externalTotal ? (externalTotal as number) : 0
	const totalPages = Math.ceil(total / pageSize)

	const handlePageChange = externalOnPageChange
		? (externalOnPageChange as (page: number) => void)
		: setLocalCurrentPage

	const handlePageSizeChange = externalOnPageSizeChange
		? (externalOnPageSizeChange as (size: number) => void)
		: setLocalPageSize

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

	return (
		<>
			<div
				className={`relative flex items-center justify-between gap-4 ${
					editMode
						? 'cursor-pointer rounded-lg border border-dashed border-primary/40 p-3 hover:border-solid hover:border-primary'
						: ''
				}`}
				onClick={editMode ? () => setShowSettings(true) : undefined}
			>
				<span className='whitespace-nowrap text-sm text-muted-foreground'>
					Showing {Math.min((currentPage - 1) * pageSize + 1, total)} to{' '}
					{Math.min(currentPage * pageSize, total)} of {total} results
				</span>

				<div className='flex items-center gap-6'>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={e => {
										if (editMode) return
										e.stopPropagation()
										handlePageChange(Math.max(1, currentPage - 1))
									}}
									className={
										currentPage === 1 || editMode
											? 'pointer-events-none opacity-50'
											: 'cursor-pointer'
									}
								/>
							</PaginationItem>
							{[...Array(Math.min(5, totalPages))].map((_, i) => {
								const page = i + 1
								return (
									<PaginationItem key={page}>
										<PaginationLink
											onClick={e => {
												if (editMode) return
												e.stopPropagation()
												handlePageChange(page)
											}}
											isActive={currentPage === page}
											className={editMode ? '' : 'cursor-pointer'}
										>
											{page}
										</PaginationLink>
									</PaginationItem>
								)
							})}
							{totalPages > 5 && (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							)}
							<PaginationItem>
								<PaginationNext
									onClick={e => {
										if (editMode) return
										e.stopPropagation()
										handlePageChange(Math.min(totalPages, currentPage + 1))
									}}
									className={
										currentPage === totalPages || editMode
											? 'pointer-events-none opacity-50'
											: 'cursor-pointer'
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>

					<Field orientation='horizontal' className='w-fit items-center gap-2'>
						<FieldLabel htmlFor='select-rows-per-page' className='text-sm'>
							Rows
						</FieldLabel>
						<Select
							value={String(pageSize)}
							onValueChange={value => handlePageSizeChange(Number(value))}
						>
							<SelectTrigger className='w-20' id='select-rows-per-page'>
								<SelectValue />
							</SelectTrigger>
							<SelectContent align='start'>
								<SelectGroup>
									{pageSizeOptions.map(size => (
										<SelectItem key={size} value={String(size)}>
											{size}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</Field>
				</div>
			</div>

			<FormModal
				open={showSettings}
				onOpenChange={setShowSettings}
				title='Pagination Settings'
				description='Configure pagination behavior'
				fieldConfig={listPaginationConfig}
				initialValues={config}
				onSubmit={handleSaveSettings}
				onDelete={onDelete ? handleDelete : undefined}
			/>
		</>
	)
}
