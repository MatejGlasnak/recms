import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: 'horizontal' | 'vertical'
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
	({ className, orientation = 'vertical', ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'flex gap-2',
					orientation === 'horizontal'
						? 'flex-row items-center justify-between'
						: 'flex-col',
					className
				)}
				{...props}
			/>
		)
	}
)
Field.displayName = 'Field'

const FieldContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props} />
	}
)
FieldContent.displayName = 'FieldContent'

const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
	({ className, ...props }, ref) => {
		return (
			<label
				ref={ref}
				className={cn(
					'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
					className
				)}
				{...props}
			/>
		)
	}
)
FieldLabel.displayName = 'FieldLabel'

const FieldDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
})
FieldDescription.displayName = 'FieldDescription'

const FieldError = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	return <p ref={ref} className={cn('text-sm text-destructive', className)} {...props} />
})
FieldError.displayName = 'FieldError'

export { Field, FieldContent, FieldLabel, FieldDescription, FieldError }
