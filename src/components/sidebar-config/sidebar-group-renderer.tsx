'use client'

import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { useGo, useResourceParams } from '@refinedev/core'
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

/**
 * Component for rendering a resource item with Refine navigation
 */
function ResourceMenuItem({ item, Icon }: { item: SidebarItem; Icon?: LucideIcon }) {
	const go = useGo()

	// Get the resource directly by passing the resourceId (which is the identifier)
	// Note: Only call this for resource items, so we pass the resourceId conditionally
	const { resource } = useResourceParams(
		item.type === 'resource' ? { resource: item.resourceId } : {}
	)

	if (item.type !== 'resource') return null

	const label = item.label || item.resourceName

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()

		if (resource) {
			// Use Refine's navigation to go to the resource list page
			go({
				to: resource.list || `/${resource.name}`,
				type: 'push'
			})
		}
	}

	return (
		<SidebarMenuButton onClick={handleClick}>
			{Icon && <Icon />}
			<span>{label}</span>
		</SidebarMenuButton>
	)
}

/**
 * Component for rendering a resource item in submenu with Refine navigation
 */
function ResourceMenuSubButton({ item, Icon }: { item: SidebarItem; Icon?: LucideIcon }) {
	const go = useGo()

	// Get the resource directly by passing the resourceId (which is the identifier)
	// Note: Only call this for resource items, so we pass the resourceId conditionally
	const { resource } = useResourceParams(
		item.type === 'resource' ? { resource: item.resourceId } : {}
	)

	if (item.type !== 'resource') return null

	const label = item.label || item.resourceName

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault()

		if (resource) {
			// Use Refine's navigation to go to the resource list page
			go({
				to: resource.list || `/${resource.name}`,
				type: 'push'
			})
		}
	}

	return (
		<SidebarMenuSubButton onClick={handleClick}>
			{Icon && <Icon />}
			<span>{label}</span>
		</SidebarMenuSubButton>
	)
}

function renderItem(item: SidebarItem): React.ReactNode {
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
		return (
			<SidebarMenuItem key={item.id}>
				<ResourceMenuItem item={item} Icon={Icon} />
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
		return <ResourceMenuSubButton item={item} Icon={Icon} />
	}

	return null
}

export function SidebarGroupRenderer({ group }: SidebarGroupRendererProps) {
	const visibleItems = group.maxItems ? group.items.slice(0, group.maxItems) : group.items
	const hasMore = group.maxItems !== undefined && group.items.length > group.maxItems
	const remainingCount = group.maxItems !== undefined ? group.items.length - group.maxItems : 0

	return (
		<SidebarGroup>
			{group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
			<SidebarMenu>
				{visibleItems.map(item => renderItem(item))}
				{hasMore && (
					<SidebarMenuItem>
						<SidebarMenuButton className='text-sidebar-foreground/70'>
							<span>...{remainingCount} more</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroup>
	)
}
