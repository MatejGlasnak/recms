'use client'

import type { ReactNode } from 'react'

export interface ConfigEmptyStateProps {
	title: string
	description: string
	className?: string
	/** Optional primary action (e.g. "Create tab" button). */
	action?: ReactNode
}

export function ConfigEmptyState({
	title,
	description,
	className = '',
	action
}: ConfigEmptyStateProps) {
	return (
		<div
			className={
				'overflow-hidden rounded-md border border-border flex flex-col items-center justify-center min-h-[min(24rem,60vh)] py-16 px-4 text-center ' +
				className
			}
		>
			<div className='max-w-md space-y-2'>
				<h3 className='text-lg font-semibold'>{title}</h3>
				<p className='text-sm text-muted-foreground'>{description}</p>
				{action && <div className='pt-3'>{action}</div>}
			</div>
		</div>
	)
}
