'use client'

import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'
import { cn } from '@/lib/utils'

export function TextareaField({
	field,
	value,
	onChange,
	error,
	disabled,
	readOnly
}: FieldComponentProps) {
	const sizeClasses = {
		tiny: 'h-16',
		small: 'h-24',
		large: 'h-48',
		huge: 'h-64',
		giant: 'h-96'
	}

	return (
		<Field data-invalid={!!error}>
			{field.label && (
				<FieldLabel htmlFor={field.name}>
					{field.label}
					{field.required && <span className='text-destructive ml-1'>*</span>}
				</FieldLabel>
			)}
			{field.commentAbove && <FieldDescription>{field.commentAbove}</FieldDescription>}
			<Textarea
				id={field.name}
				name={field.name}
				value={String(value ?? '')}
				onChange={e => onChange(e.target.value)}
				placeholder={field.placeholder}
				disabled={disabled || field.disabled}
				readOnly={readOnly || field.readOnly}
				autoFocus={field.autoFocus}
				className={cn(field.size && sizeClasses[field.size], field.cssClass)}
				aria-invalid={!!error}
				{...field.attributes}
			/>
			{field.comment && <FieldDescription>{field.comment}</FieldDescription>}
			{error && <FieldError>{error}</FieldError>}
		</Field>
	)
}
