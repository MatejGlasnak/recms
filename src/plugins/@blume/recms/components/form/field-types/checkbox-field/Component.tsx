'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
	Field,
	FieldContent,
	FieldLabel,
	FieldDescription,
	FieldError
} from '@/components/ui/field'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'

export function CheckboxField({
	field,
	value,
	onChange,
	error,
	disabled,
	readOnly
}: FieldComponentProps) {
	const checked = Boolean(value)

	return (
		<Field orientation='horizontal' data-invalid={!!error}>
			<Checkbox
				id={field.name}
				checked={checked}
				onCheckedChange={onChange}
				disabled={disabled || field.disabled || readOnly || field.readOnly}
				className={field.cssClass}
				aria-invalid={!!error}
				{...field.attributes}
			/>
			<FieldContent>
				{field.label && (
					<FieldLabel htmlFor={field.name}>
						{field.label}
						{field.required && <span className='text-destructive ml-1'>*</span>}
					</FieldLabel>
				)}
				{(field.commentAbove || field.comment) && (
					<FieldDescription>{field.commentAbove || field.comment}</FieldDescription>
				)}
				{error && <FieldError>{error}</FieldError>}
			</FieldContent>
		</Field>
	)
}
