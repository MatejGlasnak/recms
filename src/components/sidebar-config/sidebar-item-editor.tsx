'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import type { SidebarItem, SidebarItemType } from '@/lib/types/sidebar-config'
import { ICON_OPTIONS } from '@/lib/constants/icons'
import { useResources } from '@/lib/hooks/use-resources'

interface SidebarItemEditorProps {
	item?: SidebarItem
	onSave: (item: SidebarItem) => void
	onCancel: () => void
}

export function SidebarItemEditor({ item, onSave, onCancel }: SidebarItemEditorProps) {
	const [type, setType] = useState<SidebarItemType>(item?.type || 'link')
	const [label, setLabel] = useState(item?.label || '')
	const [icon, setIcon] = useState(item?.icon || '')
	const [href, setHref] = useState(item?.type === 'link' ? (item as any).href : '')
	const [resourceId, setResourceId] = useState(
		item?.type === 'resource' ? (item as any).resourceId : ''
	)

	// Fetch resources using TanStack Query
	const { data: availableResources = [], isLoading: loadingResources } = useResources()

	const handleSave = () => {
		const baseItem = {
			id: item?.id || `item-${Date.now()}`,
			type,
			icon: icon || undefined,
			label: label || undefined
		}

		let newItem: SidebarItem

		switch (type) {
			case 'resource': {
				const resource = availableResources.find(r => r.id === resourceId)
				newItem = {
					...baseItem,
					type: 'resource',
					resourceId: resourceId || '1',
					resourceName: resource?.label || 'Unknown Resource',
					label: label || resource?.label
				}
				break
			}
			case 'link':
				newItem = {
					...baseItem,
					type: 'link',
					href: href || '#',
					label: label || 'Untitled Link'
				}
				break
			case 'group':
				newItem = {
					...baseItem,
					type: 'group',
					label: label || 'Untitled Group',
					items: item?.type === 'group' ? (item as any).items : []
				}
				break
			default:
				return
		}

		onSave(newItem)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{item ? 'Edit Item' : 'Add Item'}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label>Item Type</Label>
						<Select
							value={type}
							onValueChange={value => setType(value as SidebarItemType)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='link'>Link</SelectItem>
								<SelectItem value='resource'>Resource</SelectItem>
								<SelectItem value='group'>Group</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{type === 'resource' && (
						<div className='space-y-2'>
							<Label>Resource</Label>
							<Select
								value={resourceId}
								onValueChange={setResourceId}
								disabled={loadingResources}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											loadingResources
												? 'Loading resources...'
												: 'Select a resource'
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{loadingResources ? (
										<div className='flex items-center justify-center p-2'>
											<Loader2 className='h-4 w-4 animate-spin' />
										</div>
									) : availableResources.length === 0 ? (
										<div className='p-2 text-center'>
											<p className='text-sm text-muted-foreground mb-2'>
												No resources available
											</p>
											<Button variant='outline' size='sm' asChild>
												<Link href='/admin/settings/configuration/resources'>
													<Plus className='h-4 w-4 mr-2' />
													Create Resource
												</Link>
											</Button>
										</div>
									) : (
										availableResources.map(resource => (
											<SelectItem key={resource.id} value={resource.id}>
												{resource.label}x
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>
					)}

					{type === 'link' && (
						<div className='space-y-2'>
							<Label>URL</Label>
							<Input
								value={href}
								onChange={e => setHref(e.target.value)}
								placeholder='/admin/page'
							/>
						</div>
					)}

					<div className='space-y-2'>
						<Label>
							Label{' '}
							{type === 'resource' && (
								<span className='text-muted-foreground'>
									(optional, uses resource name if empty)
								</span>
							)}
						</Label>
						<Input
							value={label}
							onChange={e => setLabel(e.target.value)}
							placeholder={
								type === 'resource'
									? availableResources.find(r => r.id === resourceId)?.label ||
									  'Resource label'
									: 'Item label'
							}
							disabled={loadingResources && type === 'resource'}
						/>
					</div>

					<div className='space-y-2'>
						<Label>Icon (optional)</Label>
						<Select value={icon} onValueChange={setIcon}>
							<SelectTrigger>
								<SelectValue placeholder='Select an icon' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='none'>None</SelectItem>
								{ICON_OPTIONS.map(option => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleSave}
					disabled={loadingResources || (type === 'resource' && !resourceId)}
				>
					Save Item
				</Button>
				<Button variant='outline' onClick={onCancel}>
					Cancel
				</Button>
			</CardFooter>
		</Card>
	)
}
