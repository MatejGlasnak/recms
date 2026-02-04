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
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import type { BlockComponentProps } from '../../registry'
import { useState } from 'react'
import { FormModal } from '../../form/FormModal'
import { listPaginationConfig } from './config'

export function ListPagination({
	blockConfig,
	editMode,
	onConfigUpdate,
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
		pageSizeOptions?: number[]
	}

	const pageSizeValue = config.pageSize ?? 10
	const pageSizeOptions = config.pageSizeOptions ?? [10, 25, 50, 100]

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

	return (
		<>
			<div
				className='relative flex items-center justify-between mt-6'
				onClick={editMode ? () => setShowSettings(true) : undefined}
			>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-muted-foreground'>Rows per page:</span>
					<Select
						value={String(pageSize)}
						onValueChange={value => handlePageSizeChange(Number(value))}
						disabled={editMode}
					>
						<SelectTrigger className='h-9 w-[70px]'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map(size => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className='text-sm text-muted-foreground'>
						Showing {Math.min((currentPage - 1) * pageSize + 1, total)} to{' '}
						{Math.min(currentPage * pageSize, total)} of {total} results
					</span>
				</div>

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
			</div>

			<FormModal
				open={showSettings}
				onOpenChange={setShowSettings}
				title='Pagination Settings'
				description='Configure pagination behavior'
				fieldConfig={listPaginationConfig}
				initialValues={config}
				onSubmit={handleSaveSettings}
			/>
		</>
	)
}
