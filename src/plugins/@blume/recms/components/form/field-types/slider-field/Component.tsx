'use client'

import { Slider } from '@/components/ui/slider'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Columns } from 'lucide-react'
import type { FieldComponentProps } from '../../../registry/FieldRegistry'

export function SliderField({
	field,
	value,
	onChange,
	error,
	disabled,
	readOnly
}: FieldComponentProps) {
	const numValue = typeof value === 'number' ? value : (field.default as number) ?? 1
	const min = (field.min ?? 1) as number
	const max = (field.max ?? 12) as number
	const step = (field.step ?? 1) as number

	return (
		<Field data-invalid={!!error}>
			{field.label && (
				<FieldLabel htmlFor={field.name}>
					{field.label}
					{field.required && <span className='ml-1 text-destructive'>*</span>}
				</FieldLabel>
			)}
			{field.commentAbove && <FieldDescription>{field.commentAbove}</FieldDescription>}
			<div className='flex items-center gap-4'>
				<Slider
					id={field.name}
					min={min}
					max={max}
					step={step}
					value={[numValue]}
					onValueChange={values => onChange(values[0])}
					disabled={disabled || field.disabled || readOnly || field.readOnly}
					className='flex-1'
					aria-invalid={!!error}
				/>
				<InputGroup className='w-20'>
					<InputGroupAddon align='inline-start'>
						<Columns className='size-3.5' />
					</InputGroupAddon>
					<InputGroupInput
						type='number'
						min={min}
						max={max}
						value={numValue}
						onChange={e => {
							const val = Math.min(
								max,
								Math.max(min, parseInt(e.target.value, 10) || min)
							)
							onChange(val)
						}}
						disabled={disabled || field.disabled || readOnly || field.readOnly}
						className='text-center'
						aria-invalid={!!error}
					/>
				</InputGroup>
			</div>
			{field.comment && <FieldDescription>{field.comment}</FieldDescription>}
			{error && <FieldError>{error}</FieldError>}
		</Field>
	)
}
