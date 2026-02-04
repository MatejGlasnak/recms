'use client'

import { Switch } from '@/components/ui/switch'
import {
	Field,
	FieldContent,
	FieldLabel,
	FieldDescription,
	FieldError
} from '@/components/ui/field'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'

export function SwitchField({
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
			<FieldContent>
				{field.label && (
					<FieldLabel htmlFor={field.name}>
						{field.label}
						{field.required && <span className='ml-1 text-destructive'>*</span>}
					</FieldLabel>
				)}
				{(field.commentAbove || field.comment) && (
					<FieldDescription>{field.commentAbove || field.comment}</FieldDescription>
				)}
				{error && <FieldError>{error}</FieldError>}
			</FieldContent>
			<Switch
				id={field.name}
				checked={checked}
				onCheckedChange={onChange}
				disabled={disabled || field.disabled || readOnly || field.readOnly}
				className={field.cssClass}
				aria-invalid={!!error}
				{...field.attributes}
			/>
		</Field>
	)
}
