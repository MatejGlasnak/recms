import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Spinner({
	className,
	'data-icon': dataIcon,
	...props
}: React.ComponentProps<'svg'> & { 'data-icon'?: 'inline-start' | 'inline-end' }) {
	return (
		<Loader2Icon
			role='status'
			aria-label='Loading'
			data-icon={dataIcon}
			className={cn(
				'size-4 shrink-0 animate-spin',
				dataIcon === 'inline-start' && 'mr-2',
				dataIcon === 'inline-end' && 'ml-2',
				className
			)}
			{...props}
		/>
	)
}

export { Spinner }
