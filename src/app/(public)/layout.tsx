export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='min-h-screen bg-background'>
			<div className='absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]' />
			<div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5' />
			<div className='relative'>{children}</div>
		</div>
	)
}
