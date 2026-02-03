'use client'

import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { SidebarGroup as SidebarGroupType, SidebarItem } from '@/lib/types/sidebar-config'
import { AVAILABLE_ICONS } from '@/lib/constants/icons'

interface SidebarGroupRendererProps {
	group: SidebarGroupType
}

function renderItem(item: SidebarItem, depth = 0): React.ReactNode {
	const Icon = item.icon ? AVAILABLE_ICONS[item.icon] : undefined

	if (item.type === 'group') {
		return (
			<Collapsible key={item.id} defaultOpen={false} className='group/collapsible'>
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton>
							{Icon && <Icon />}
							<span>{item.label || 'Untitled Group'}</span>
							<ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.items?.map(subItem => (
								<SidebarMenuSubItem key={subItem.id}>
									{renderSubItem(subItem)}
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		)
	}

	if (item.type === 'link') {
		return (
			<SidebarMenuItem key={item.id}>
				<SidebarMenuButton asChild>
					<Link href={item.href || '#'}>
						{Icon && <Icon />}
						<span>{item.label || 'Untitled Link'}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		)
	}

	if (item.type === 'resource') {
		const label = item.label || item.resourceName
		// In the future, this will link to the actual resource
		return (
			<SidebarMenuItem key={item.id}>
				<SidebarMenuButton asChild>
					<Link href={`#resource-${item.resourceId}`}>
						{Icon && <Icon />}
						<span>{label}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		)
	}

	return null
}

function renderSubItem(item: SidebarItem): React.ReactNode {
	const Icon = item.icon ? AVAILABLE_ICONS[item.icon] : undefined

	if (item.type === 'group') {
		// Nested group in submenu
		return (
			<Collapsible key={item.id} defaultOpen={false} className='group/collapsible'>
				<CollapsibleTrigger asChild>
					<SidebarMenuSubButton>
						{Icon && <Icon />}
						<span>{item.label || 'Untitled Group'}</span>
						<ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
					</SidebarMenuSubButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{item.items?.map(subItem => (
							<SidebarMenuSubItem key={subItem.id}>
								{renderSubItem(subItem)}
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		)
	}

	if (item.type === 'link') {
		return (
			<SidebarMenuSubButton asChild>
				<Link href={item.href || '#'}>
					{Icon && <Icon />}
					<span>{item.label || 'Untitled Link'}</span>
				</Link>
			</SidebarMenuSubButton>
		)
	}

	if (item.type === 'resource') {
		const label = item.label || item.resourceName
		return (
			<SidebarMenuSubButton asChild>
				<Link href={`#resource-${item.resourceId}`}>
					{Icon && <Icon />}
					<span>{label}</span>
				</Link>
			</SidebarMenuSubButton>
		)
	}

	return null
}

export function SidebarGroupRenderer({ group }: SidebarGroupRendererProps) {
	const visibleItems = group.maxItems ? group.items.slice(0, group.maxItems) : group.items
	const hasMore = group.maxItems && group.items.length > group.maxItems

	return (
		<SidebarGroup>
			{group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
			<SidebarMenu>
				{visibleItems.map(item => renderItem(item))}
				{hasMore && (
					<SidebarMenuItem>
						<SidebarMenuButton className='text-sidebar-foreground/70'>
							<span>...{group.items.length - group.maxItems} more</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroup>
	)
}
