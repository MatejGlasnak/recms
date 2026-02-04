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

export interface FilterComboboxProps {
	id: string
	label: string
	value: string | string[]
	onChange: (value: string | string[]) => void
	placeholder?: string
	options?: { label: string; value: string }[]
	multiple?: boolean
	disabled?: boolean
}

function FilterComboboxMultiple({
	id,
	label,
	value,
	onChange,
	placeholder,
	options = [],
	disabled = false
}: FilterComboboxProps & { value: string[] }) {
	const selectedValues = Array.isArray(value) ? value : []
	return (
		<div className='flex flex-col gap-1.5'>
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

function FilterComboboxSingle({
	id,
	label,
	value,
	onChange,
	placeholder,
	options = [],
	disabled = false
}: FilterComboboxProps & { value: string }) {
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

export function FilterCombobox(props: FilterComboboxProps) {
	if (props.multiple) {
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
