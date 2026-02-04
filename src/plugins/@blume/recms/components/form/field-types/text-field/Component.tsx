'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
		<div className='space-y-2'>
			{field.label && (
				<Label htmlFor={field.name}>
					{field.label}
					{field.required && <span className='text-destructive ml-1'>*</span>}
				</Label>
			)}
			{field.commentAbove && (
				<p className='text-sm text-muted-foreground'>{field.commentAbove}</p>
			)}
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
				{...field.attributes}
			/>
			{field.comment && <p className='text-sm text-muted-foreground'>{field.comment}</p>}
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
