import { LoginForm } from '@/components/login-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth/auth'

export default async function Page() {
	// Check if user is already authenticated
	const session = await getServerSession(authOptions)

	// If authenticated, redirect to dashboard
	if (session) {
		redirect('/admin/dashboard')
	}

	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<LoginForm />
			</div>
		</div>
	)
}
