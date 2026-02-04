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
				'container w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[min(24rem,60vh)]'
			}
			style={{ paddingTop: '24px' }}
		>
			<Spinner className='size-6 mb-2' />
			<p className='text-sm text-muted-foreground'>{message}</p>
		</div>
	)
}
