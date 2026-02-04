'use client'

import { Label } from '@/components/ui/label'
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
import type { BlockComponentProps } from '../../registry/BlockRegistry'

interface FilterComboboxConfig {
	label?: string
	field?: string
	operator?: 'eq' | 'ne' | 'in' | 'nin' | 'contains'
	placeholder?: string
	defaultValue?: string
	options?: { label: string; value: string }[]
	multiple?: boolean
}

// Combobox Filter Components
function ComboboxFilterMultiple({
	id,
	label,
	value,
	onChange,
	placeholder,
	options = [],
	disabled = false
}: {
	id: string
	label: string
	value: string[]
	onChange: (value: string | string[]) => void
	placeholder?: string
	options?: { label: string; value: string }[]
	disabled?: boolean
}) {
	const selectedValues = Array.isArray(value) ? value : []
	return (
		<div className='flex flex-col gap-1.5 w-full'>
			<Label htmlFor={id} className='text-xs text-muted-foreground'>
				{label}
			</Label>
			<Combobox
				value={selectedValues}
				onValueChange={(value: string | string[]): void =>
					onChange(Array.isArray(value) ? value : value ? [value] : [])
				}
				disabled={disabled}
				multiple
				items={options}
			>
				<ComboboxChips className='w-[240px] min-h-10'>
					<ComboboxChipsInput
						placeholder={placeholder || `Select ${label.toLowerCase()}...`}
						disabled={disabled}
					/>
				</ComboboxChips>
				<ComboboxContent>
					<ComboboxList>
						<ComboboxEmpty>No results found.</ComboboxEmpty>
						{options.map(option => (
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

function ComboboxFilterSingle({
	id,
	label,
	value,
	onChange,
	placeholder,
	options = [],
	disabled = false
}: {
	id: string
	label: string
	value: string
	onChange: (value: string | string[]) => void
	placeholder?: string
	options?: { label: string; value: string }[]
	disabled?: boolean
}) {
	return (
		<div className='flex flex-col gap-1.5'>
			<Label htmlFor={id} className='text-xs text-muted-foreground'>
				{label}
			</Label>
			<Combobox
				value={value || ''}
				onValueChange={(v: string | null): void => onChange(v ?? '')}
				disabled={disabled}
				items={options}
			>
				<ComboboxInput
					placeholder={placeholder || `Select ${label.toLowerCase()}...`}
					showClear
					className='w-[240px]'
					disabled={disabled}
				/>
				<ComboboxContent>
					<ComboboxList>
						<ComboboxEmpty>No results found.</ComboboxEmpty>
						{options.map(option => (
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

export function FilterCombobox({
	blockConfig,
	editMode,
	filterValue,
	onFilterChange
}: BlockComponentProps) {
	const config = blockConfig.config as FilterComboboxConfig
	const label = config.label ?? 'Filter'
	const field = config.field ?? ''
	const placeholder = config.placeholder
	const options = config.options ?? []
	const multiple = config.multiple ?? false

	const id = blockConfig.id

	// Get the current filter value
	const currentValue = typeof filterValue === 'function' ? filterValue(field) : filterValue

	// Handle filter value changes
	const handleChange = (value: unknown) => {
		if (onFilterChange && typeof onFilterChange === 'function') {
			onFilterChange(field, value)
		}
	}

	if (multiple) {
		const arrayValue = Array.isArray(currentValue) ? currentValue : []
		return (
			<ComboboxFilterMultiple
				id={id}
				label={label}
				value={arrayValue}
				onChange={handleChange}
				placeholder={placeholder}
				options={options}
				disabled={editMode}
			/>
		)
	}
	const stringValue = typeof currentValue === 'string' ? currentValue : ''
	return (
		<ComboboxFilterSingle
			id={id}
			label={label}
			value={stringValue}
			onChange={handleChange}
			placeholder={placeholder}
			options={options}
			disabled={editMode}
		/>
	)
}
