'use client'

import * as React from 'react'
import { Home, Loader2, Settings, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { NavUser } from '@/components/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarGroup,
	SidebarGroupContent
} from '@/components/ui/sidebar'
import { useSidebarConfig } from '@/lib/contexts/sidebar-config-context'
import { SidebarGroupRenderer } from '@/components/sidebar-config/sidebar-group-renderer'

const userData = {
	name: 'Matej Glasnak',
	email: 'matej.glasnak@blume.sk',
	avatar: '/avatars/shadcn.jpg'
}

// Hardcoded bottom items (settings, upgrade, etc.)
const bottomItems = [
	{
		title: 'Settings',
		url: '/admin/settings',
		icon: Settings
	},
	{
		title: 'Upgrade',
		url: '#',
		icon: Sparkles
	}
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { config, isLoading } = useSidebarConfig()

	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:!p-1.5'
						>
							<Link href='/admin/dashboard'>
								<Home className='h-5 w-5' />
								<span className='text-base font-semibold'>ReCMS</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{isLoading ? (
					<div className='flex items-center justify-center h-full'>
						<Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
					</div>
				) : config && config.groups.length > 0 ? (
					<>
						{config.groups.map(group => (
							<SidebarGroupRenderer key={group.id} group={group} />
						))}
					</>
				) : null}

				{/* Hardcoded bottom items */}
				<SidebarGroup className='mt-auto'>
					<SidebarGroupContent>
						<SidebarMenu>
							{bottomItems.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon className='h-4 w-4' />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	)
}
