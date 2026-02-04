'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'

export function TextField({
	field,
	value,
	onChange,
	error,
	disabled,
	readOnly
}: FieldComponentProps) {
	return (
		<Field data-invalid={!!error}>
			{field.label && (
				<FieldLabel htmlFor={field.name}>
					{field.label}
					{field.required && <span className='ml-1 text-destructive'>*</span>}
				</FieldLabel>
			)}
			{field.commentAbove && <FieldDescription>{field.commentAbove}</FieldDescription>}
			<Input
				id={field.name}
				name={field.name}
				value={String(value ?? '')}
				onChange={e => onChange(e.target.value)}
				placeholder={field.placeholder}
				disabled={disabled || field.disabled}
				readOnly={readOnly || field.readOnly}
				autoFocus={field.autoFocus}
				className={field.cssClass}
				aria-invalid={!!error}
				{...field.attributes}
			/>
			{field.comment && <FieldDescription>{field.comment}</FieldDescription>}
			{error && <FieldError>{error}</FieldError>}
		</Field>
	)
}
