'use client'

import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'

export function DropdownField({
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
					{field.required && <span className='text-destructive ml-1'>*</span>}
				</FieldLabel>
			)}
			{field.commentAbove && <FieldDescription>{field.commentAbove}</FieldDescription>}
			<Select
				value={String(value ?? '')}
				onValueChange={onChange}
				disabled={disabled || field.disabled || readOnly || field.readOnly}
			>
				<SelectTrigger id={field.name} className={field.cssClass} aria-invalid={!!error}>
					<SelectValue placeholder={field.placeholder ?? 'Select an option'} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{options.map(option => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{field.comment && <FieldDescription>{field.comment}</FieldDescription>}
			{error && <FieldError>{error}</FieldError>}
		</Field>
	)
}
