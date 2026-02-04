'use client'

import type { ReactNode } from 'react'
import type { VisibilityState } from '@tanstack/react-table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AlertCircle, Settings2 } from 'lucide-react'
import type { ListConfig } from '../../types'
import { formatHeader } from '../../utils'
import { ListPageHeader } from './ListPageHeader'
import { ListPageFilters } from './ListPageFilters'
import { ListPageTable } from './ListPageTable'
import { ListPagination } from './ListPagination'

export interface ListPageLayoutProps {
	resourceId: string
	resourceMeta?: { label?: string }
	listConfig: ListConfig | undefined
	editMode: boolean
	onEditModeToggle: () => void
	filterValues: Record<string, unknown>
	onFilterChange: (filters: Record<string, unknown>) => void
	columnVisibility: VisibilityState
	onColumnVisibilityChange: (field: string, visible: boolean) => void
	currentPage: number
	pageSize: number
	onPageChange: (page: number) => void
	onPageSizeChange: (size: number) => void
	total: number
	isError: boolean
	errorMessage?: string
	children: ReactNode
}

export function ListPageLayout({
	resourceId,
	resourceMeta,
	listConfig,
	editMode,
	onEditModeToggle,
	filterValues,
	onFilterChange,
	columnVisibility,
	onColumnVisibilityChange,
	currentPage,
	pageSize,
	onPageChange,
	onPageSizeChange,
	total,
	isError,
	errorMessage,
	children
}: ListPageLayoutProps) {
	const defaultTitle = (resourceMeta?.label as string) || formatHeader(resourceId)
	const defaultDescription = `Manage and view all ${defaultTitle.toLowerCase()} in your system`

	if (isError) {
		return (
			<div
				className='container w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6'
				style={{ paddingTop: '24px' }}
			>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error loading data</AlertTitle>
					<AlertDescription>
						{errorMessage ?? 'Something went wrong loading the data.'}
					</AlertDescription>
				</Alert>
			</div>
		)
	}

	const configuredColumns = listConfig?.columns ?? []

	return (
		<div
			className='container w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 relative'
			style={{ paddingTop: '24px' }}
		>
			<ListPageHeader
				resourceId={resourceId}
				currentConfig={listConfig}
				editMode={editMode}
				onEditModeToggle={onEditModeToggle}
				defaultTitle={defaultTitle}
				defaultDescription={defaultDescription}
			/>

			<div className='flex items-center justify-between gap-4'>
				<div className='flex-1'>
					<ListPageFilters
						resourceId={resourceId}
						currentConfig={listConfig}
						editMode={editMode}
						filters={filterValues}
						onFilterChange={onFilterChange}
					/>
				</div>
				{!editMode && (
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
							{configuredColumns.map(column => (
								<DropdownMenuCheckboxItem
									key={column.field}
									className='capitalize'
									checked={columnVisibility[column.field] !== false}
									onCheckedChange={value =>
										onColumnVisibilityChange(column.field, !!value)
									}
								>
									{column.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			<ListPageTable resourceId={resourceId} currentConfig={listConfig} editMode={editMode}>
				{children}
			</ListPageTable>

			<ListPagination
				currentPage={currentPage}
				pageSize={pageSize}
				total={total}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
			/>
		</div>
	)
}
