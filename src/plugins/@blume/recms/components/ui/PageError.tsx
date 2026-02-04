import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export interface PageErrorProps {
	/**
	 * The error message to display
	 */
	message?: string
	/**
	 * Optional error title
	 */
	title?: string
	/**
	 * Optional Error object to extract message from
	 */
	error?: Error | unknown
	/**
	 * Custom className for the container
	 */
	className?: string
	/**
	 * Custom className for the Alert component
	 */
	alertClassName?: string
}

export function PageError({ message, title, error, className, alertClassName }: PageErrorProps) {
	// Determine the error message
	const errorMessage =
		message ?? (error instanceof Error ? error.message : null) ?? 'An unexpected error occurred'

	return (
		<div className={className || 'container mx-auto w-full px-4 py-6 sm:px-6 lg:px-8'}>
			<Alert variant='destructive' className={alertClassName}>
				{title && (
					<div className='mb-1 flex items-center gap-2'>
						<AlertCircle className='size-4' />
						<AlertTitle>{title}</AlertTitle>
					</div>
				)}
				<AlertDescription className='text-sm'>{errorMessage}</AlertDescription>
			</Alert>
		</div>
	)
}
