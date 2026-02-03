import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-8'>
			<div className='mx-auto max-w-2xl text-center space-y-6'>
				<h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
					Welcome to{' '}
					<span className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
						ReCMS
					</span>
				</h1>
				<p className='text-lg text-muted-foreground'>
					A modern, flexible content management system built with Next.js and GraphQL.
				</p>
				<div className='flex gap-4 justify-center pt-4'>
					<Button asChild size='lg'>
						<Link href='/auth/login'>Admin Login</Link>
					</Button>
					<Button asChild variant='outline' size='lg'>
						<Link href='/admin/dashboard'>Dashboard</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
