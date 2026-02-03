import { Toaster } from '@/components/ui/toaster'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='min-h-screen bg-background'>
			<div className='absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent,white)]' />
			<div className='absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-secondary/5' />
			<div className='relative'>
				{children}
				<Toaster />
			</div>
		</div>
	)
}
