import { Spinner } from '@/components/ui/spinner'

export interface PageLoadingProps {
	/**
	 * The message to display below the spinner
	 */
	message?: string
	/**
	 * Custom className for the container
	 */
	className?: string
}

export function PageLoading({ message = 'Loading…', className }: PageLoadingProps) {
	return (
		<div
			className={
				className ||
				'container mx-auto flex min-h-[min(24rem,60vh)] w-full flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8'
			}
		>
			<Spinner className='mb-2 size-6' />
			<p className='text-sm text-muted-foreground'>{message}</p>
		</div>
	)
}
