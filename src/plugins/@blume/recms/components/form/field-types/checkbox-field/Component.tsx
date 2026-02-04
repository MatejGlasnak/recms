'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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
		<div className='space-y-2'>
			{field.commentAbove && (
				<p className='text-sm text-muted-foreground'>{field.commentAbove}</p>
			)}
			<div className='flex items-center space-x-2'>
				<Checkbox
					id={field.name}
					checked={checked}
					onCheckedChange={onChange}
					disabled={disabled || field.disabled || readOnly || field.readOnly}
					className={field.cssClass}
					{...field.attributes}
				/>
				{field.label && (
					<Label
						htmlFor={field.name}
						className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
					>
						{field.label}
						{field.required && <span className='text-destructive ml-1'>*</span>}
					</Label>
				)}
			</div>
			{field.comment && <p className='text-sm text-muted-foreground'>{field.comment}</p>}
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
