'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Combobox,
	ComboboxInput,
	ComboboxContent,
	ComboboxList,
	ComboboxItem,
	ComboboxEmpty,
	ComboboxChips,
	ComboboxChipsInput
} from '@/components/ui/combobox'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FilterConfig, ListConfig } from '@/lib/types/list-config'
import { AListFiltersEditor } from './a-list-filters-editor'

interface AListFiltersProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	editMode: boolean
	filters: Record<string, any>
	onFilterChange: (filters: Record<string, any>) => void
}

export function AListFilters({
	resourceId,
	currentConfig,
	editMode,
	filters,
	onFilterChange
}: AListFiltersProps) {
	const [editorOpen, setEditorOpen] = useState(false)

	const configuredFilters = currentConfig?.filters || []

	const handleFilterValueChange = (fieldName: string, value: any) => {
		onFilterChange({
			...filters,
			[fieldName]: value
		})
	}

	const handleClearFilter = (fieldName: string) => {
		const newFilters = { ...filters }
		delete newFilters[fieldName]
		onFilterChange(newFilters)
	}

	return (
		<>
			{editMode ? (
				<div
					className='cursor-pointer transition-all border-2 border-dashed border-muted-foreground/30 rounded-md p-3 hover:border-muted-foreground/60 hover:bg-muted/30'
					onClick={() => setEditorOpen(true)}
				>
					<div className='flex items-center gap-4 flex-wrap'>
						{configuredFilters.length === 0 ? (
							<div className='text-sm text-muted-foreground'>
								No filters configured. Click to add filters.
							</div>
						) : (
							configuredFilters.map(filter => (
								<FilterField
									key={filter.id}
									filter={filter}
									value={filters[filter.field]}
									onChange={value => handleFilterValueChange(filter.field, value)}
									onClear={() => handleClearFilter(filter.field)}
									disabled={true}
								/>
							))
						)}
					</div>
				</div>
			) : (
				<div className='flex items-center gap-4 flex-wrap'>
					{configuredFilters.map(filter => (
						<FilterField
							key={filter.id}
							filter={filter}
							value={filters[filter.field]}
							onChange={value => handleFilterValueChange(filter.field, value)}
							onClear={() => handleClearFilter(filter.field)}
							disabled={false}
						/>
					))}
				</div>
			)}

			<AListFiltersEditor
				resourceId={resourceId}
				currentConfig={currentConfig}
				open={editorOpen}
				onOpenChange={setEditorOpen}
			/>
		</>
	)
}

interface FilterFieldProps {
	filter: FilterConfig
	value: any
	onChange: (value: any) => void
	onClear: () => void
	disabled: boolean
}

function FilterField({ filter, value, onChange, disabled }: FilterFieldProps) {
	switch (filter.type) {
		case 'input':
			return (
				<div className='flex flex-col gap-1.5'>
					<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
					<Input
						placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}...`}
						value={value || ''}
						onChange={e => onChange(e.target.value)}
						className='h-10 w-[240px]'
						disabled={disabled}
					/>
				</div>
			)

		case 'select':
			return (
				<div className='flex flex-col gap-1.5'>
					<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
					<Select value={value || ''} onValueChange={onChange} disabled={disabled}>
						<SelectTrigger className='h-10 w-[240px]'>
							<SelectValue
								placeholder={
									filter.placeholder || `Select ${filter.label.toLowerCase()}...`
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{filter.options?.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)

		case 'combobox':
			if (filter.multiple) {
				const selectedValues = Array.isArray(value) ? value : []
				return (
					<div className='flex flex-col gap-1.5'>
						<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
						<Combobox
							value={selectedValues}
							onValueChange={(newValue: string[]) => onChange(newValue)}
							disabled={disabled}
							multiple
							items={filter.options || []}
						>
							<ComboboxChips className='w-[240px] min-h-10'>
								<ComboboxChipsInput
									placeholder={
										filter.placeholder ||
										`Select ${filter.label.toLowerCase()}...`
									}
									disabled={disabled}
								/>
							</ComboboxChips>
							<ComboboxContent>
								<ComboboxList>
									<ComboboxEmpty>No results found.</ComboboxEmpty>
									{filter.options?.map(option => (
										<ComboboxItem key={option.value} value={option.value}>
											{option.label}
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</div>
				)
			} else {
				return (
					<div className='flex flex-col gap-1.5'>
						<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
						<Combobox
							value={value || ''}
							onValueChange={onChange}
							disabled={disabled}
							items={filter.options || []}
						>
							<ComboboxInput
								placeholder={
									filter.placeholder || `Select ${filter.label.toLowerCase()}...`
								}
								showClear
								className='w-[240px]'
								disabled={disabled}
							/>
							<ComboboxContent>
								<ComboboxList>
									<ComboboxEmpty>No results found.</ComboboxEmpty>
									{filter.options?.map(option => (
										<ComboboxItem key={option.value} value={option.value}>
											{option.label}
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					</div>
				)
			}

		case 'checkbox':
			return (
				<div className='flex items-center gap-2 h-10'>
					<Checkbox
						id={filter.id}
						checked={value === true}
						onCheckedChange={checked => onChange(checked)}
						disabled={disabled}
					/>
					<Label htmlFor={filter.id} className='cursor-pointer'>
						{filter.label}
					</Label>
				</div>
			)

		default:
			return null
	}
}
