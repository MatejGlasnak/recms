import * as React from 'react'

import { cn } from '@/lib/utils'

const Empty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				'flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-6 rounded-lg border border-dashed p-8 text-center',
				className
			)}
			{...props}
		/>
	)
)
Empty.displayName = 'Empty'

const EmptyHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex flex-col items-center gap-2', className)} {...props} />
	)
)
EmptyHeader.displayName = 'EmptyHeader'

const EmptyMedia = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'icon' }
>(({ className, variant = 'default', ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			variant === 'icon' && 'flex size-12 items-center justify-center rounded-full bg-muted',
			className
		)}
		{...props}
	/>
))
EmptyMedia.displayName = 'EmptyMedia'

const EmptyTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => (
		<h3
			ref={ref as React.Ref<HTMLParagraphElement>}
			className={cn('text-lg font-semibold', className)}
			{...props}
		/>
	)
)
EmptyTitle.displayName = 'EmptyTitle'

const EmptyDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
EmptyDescription.displayName = 'EmptyDescription'

const EmptyContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn('flex flex-wrap items-center justify-center gap-2', className)}
			{...props}
		/>
	)
)
EmptyContent.displayName = 'EmptyContent'

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
