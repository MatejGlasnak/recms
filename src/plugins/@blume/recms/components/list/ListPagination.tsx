'use client'

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
import { getPageNumbers } from '../../utils'

export interface ListPaginationProps {
	currentPage: number
	pageSize: number
	total: number
	onPageChange: (page: number) => void
	onPageSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100]

export function ListPagination({
	currentPage,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange
}: ListPaginationProps) {
	const totalPages = Math.ceil(total / pageSize)
	const pages = getPageNumbers(currentPage, totalPages)

	return (
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
							onPageSizeChange(Number(value))
							onPageChange(1)
						}}
					>
						<SelectTrigger className='h-8 w-[70px]'>
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side='top'>
							{PAGE_SIZE_OPTIONS.map(size => (
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
									if (currentPage > 1) onPageChange(currentPage - 1)
								}}
							/>
						</PaginationItem>
						{pages.map((page, idx) => {
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
											onPageChange(page as number)
										}}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							)
						})}
						<PaginationItem>
							<PaginationNext
								href='#'
								onClick={(e: React.MouseEvent) => {
									e.preventDefault()
									if (currentPage < totalPages) onPageChange(currentPage + 1)
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	)
}
