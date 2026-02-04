import { Alert, AlertDescription } from '@/components/ui/alert'

export interface InlineErrorProps {
	/**
	 * The error message to display
	 */
	message?: string
	/**
	 * Optional Error object to extract message from
	 */
	error?: Error | unknown
	/**
	 * Custom className for the Alert component
	 */
	className?: string
}

/**
 * InlineError component for displaying errors within page content
 * (not taking full page width/height)
 */
export function InlineError({ message, error, className }: InlineErrorProps) {
	// Determine the error message
	const errorMessage =
		message ?? (error instanceof Error ? error.message : null) ?? 'An unexpected error occurred'

	return (
		<Alert variant='destructive' className={className}>
			<AlertDescription className='text-sm'>{errorMessage}</AlertDescription>
		</Alert>
	)
}
