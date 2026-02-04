'use client'

import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'

export function NumberField({
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
					{field.required && <span className='text-destructive ml-1'>*</span>}
				</FieldLabel>
			)}
			{field.commentAbove && <FieldDescription>{field.commentAbove}</FieldDescription>}
			<Input
				id={field.name}
				name={field.name}
				type='number'
				value={value != null ? String(value) : ''}
				onChange={e => {
					const val = e.target.value
					onChange(val === '' ? null : Number(val))
				}}
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
