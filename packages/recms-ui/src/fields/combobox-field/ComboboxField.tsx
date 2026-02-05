'use client'

import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import {
	Combobox,
	ComboboxInput,
	ComboboxContent,
	ComboboxList,
	ComboboxItem,
	ComboboxEmpty
} from '@/components/ui/combobox'
import { ChevronRight } from 'lucide-react'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'

export function ComboboxField({
	field,
	value,
	onChange,
	error,
	disabled,
	readOnly
}: FieldComponentProps) {
	const options = field.options ?? []

	return (
		<Field data-invalid={!!error}>
			{field.label && (
				<FieldLabel htmlFor={field.name}>
					{field.label}
					{field.required && <span className='ml-1 text-destructive'>*</span>}
				</FieldLabel>
			)}
			{field.commentAbove && <FieldDescription>{field.commentAbove}</FieldDescription>}
			<Combobox
				value={value ? String(value) : ''}
				onValueChange={onChange}
				disabled={disabled || field.disabled || readOnly || field.readOnly}
			>
				<ComboboxInput
					id={field.name}
					placeholder={field.placeholder ?? 'Search or select...'}
					showTrigger
					showClear
					disabled={disabled || field.disabled || readOnly || field.readOnly}
				/>
				<ComboboxContent>
					<ComboboxList>
						<ComboboxEmpty>No results found.</ComboboxEmpty>
						{options.map(option => (
							<ComboboxItem key={option.value} value={option.value}>
								{option.icon === 'chevron-right' && (
									<ChevronRight className='size-3 text-muted-foreground' />
								)}
								{option.label}
							</ComboboxItem>
						))}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
			{field.comment && <FieldDescription>{field.comment}</FieldDescription>}
			{error && <FieldError>{error}</FieldError>}
		</Field>
	)
}
