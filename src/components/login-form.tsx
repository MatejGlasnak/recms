'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required')
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { toast } = useToast()

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})

	async function onSubmit(values: LoginFormValues) {
		setIsLoading(true)

		try {
			const result = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false
			})

			if (result?.error) {
				toast({
					title: 'Error',
					description: 'Invalid email or password',
					variant: 'destructive'
				})
			} else if (result?.ok) {
				toast({
					title: 'Success',
					description: 'Logged in successfully'
				})
				router.push('/dashboard')
				router.refresh()
			}
		} catch {
			toast({
				title: 'Error',
				description: 'Something went wrong. Please try again.',
				variant: 'destructive'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className='flex flex-col gap-6'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type='email'
													placeholder='m@example.com'
													autoComplete='email'
													{...field}
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<div className='flex items-center'>
												<FormLabel>Password</FormLabel>
												<a
													href='#'
													className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
												>
													Forgot your password?
												</a>
											</div>
											<FormControl>
												<Input
													type='password'
													placeholder='••••••••'
													autoComplete='current-password'
													{...field}
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type='submit' className='w-full' disabled={isLoading}>
									{isLoading ? 'Signing in...' : 'Login'}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
