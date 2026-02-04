'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { usePage } from '@/lib/contexts/page-context'

export function SiteHeader() {
	const { title, breadcrumbs } = usePage()

	return (
		<header className='group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear'>
			<div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
				<SidebarTrigger className='-ml-1' />
				<Separator
					orientation='vertical'
					className='mx-2 data-[orientation=vertical]:h-4'
				/>
				{breadcrumbs.length > 0 ? (
					<Breadcrumb>
						<BreadcrumbList>
							{breadcrumbs.map((crumb, index) => (
								<div key={index} className='flex items-center gap-2'>
									{index > 0 && <BreadcrumbSeparator />}
									<BreadcrumbItem>
										{crumb.href && index < breadcrumbs.length - 1 ? (
											<BreadcrumbLink
												asChild
												className={
													crumb.muted
														? 'text-muted-foreground'
														: undefined
												}
											>
												<Link href={crumb.href}>{crumb.label}</Link>
											</BreadcrumbLink>
										) : (
											<BreadcrumbPage
												className={
													crumb.muted
														? 'text-muted-foreground font-normal'
														: undefined
												}
											>
												{crumb.label}
											</BreadcrumbPage>
										)}
									</BreadcrumbItem>
								</div>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				) : (
					<h1 className='text-base font-medium'>{title}</h1>
				)}
			</div>
		</header>
	)
}
