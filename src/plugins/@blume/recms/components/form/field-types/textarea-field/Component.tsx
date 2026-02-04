'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
				{...field.attributes}
			/>
			{field.comment && <p className='text-sm text-muted-foreground'>{field.comment}</p>}
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
