'use client'

import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
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
			<Select
				value={String(value ?? '')}
				onValueChange={onChange}
				disabled={disabled || field.disabled || readOnly || field.readOnly}
			>
				<SelectTrigger id={field.name} className={field.cssClass}>
					<SelectValue placeholder={field.placeholder ?? 'Select an option'} />
				</SelectTrigger>
				<SelectContent>
					{options.map(option => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{field.comment && <p className='text-sm text-muted-foreground'>{field.comment}</p>}
			{error && <p className='text-sm text-destructive'>{error}</p>}
		</div>
	)
}
