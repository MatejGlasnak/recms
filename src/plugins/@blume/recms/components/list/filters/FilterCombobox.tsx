'use client'

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
import { Label } from '@/components/ui/label'
import type { FilterConfig } from '../../../types'

interface FilterComboboxProps {
	filter: FilterConfig
	value: string | string[]
	onChange: (value: string | string[]) => void
	disabled?: boolean
}

export function FilterComboboxMultiple({
	filter,
	value,
	onChange,
	disabled = false
}: FilterComboboxProps & { value: string[] }) {
	const selectedValues = Array.isArray(value) ? value : []
	return (
		<div className='flex flex-col gap-1.5'>
			<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
			<Combobox
				value={selectedValues}
				onValueChange={(value: string | string[]): void =>
					onChange(Array.isArray(value) ? value : value ? [value] : [])
				}
				disabled={disabled}
				multiple
				items={filter.options || []}
			>
				<ComboboxChips className='w-[240px] min-h-10'>
					<ComboboxChipsInput
						placeholder={
							filter.placeholder || `Select ${filter.label.toLowerCase()}...`
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
}

export function FilterComboboxSingle({
	filter,
	value,
	onChange,
	disabled = false
}: FilterComboboxProps & { value: string }) {
	return (
		<div className='flex flex-col gap-1.5'>
			<Label className='text-xs text-muted-foreground'>{filter.label}</Label>
			<Combobox
				value={value || ''}
				onValueChange={(v: string | null): void => onChange(v ?? '')}
				disabled={disabled}
				items={filter.options || []}
			>
				<ComboboxInput
					placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}...`}
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

export function FilterCombobox(props: FilterComboboxProps) {
	if (props.filter.multiple) {
		const value = Array.isArray(props.value) ? props.value : []
		return (
			<FilterComboboxMultiple
				{...props}
				value={value}
				onChange={(v: string | string[]) =>
					props.onChange(Array.isArray(v) ? v : v ? [v] : [])
				}
			/>
		)
	}
	const value = typeof props.value === 'string' ? props.value : ''
	return (
		<FilterComboboxSingle
			{...props}
			value={value}
			onChange={(v: string | string[]) =>
				props.onChange(typeof v === 'string' ? v : v?.[0] ?? '')
			}
		/>
	)
}
