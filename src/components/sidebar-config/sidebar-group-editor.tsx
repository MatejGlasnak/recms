'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
	ChevronDown,
	ChevronUp,
	Trash2,
	GripVertical,
	Plus,
	ChevronRight,
	Loader2
} from 'lucide-react'
import type { SidebarGroup, SidebarItem } from '@/lib/types/sidebar-config'
import { ICON_OPTIONS } from '@/lib/constants/icons'
import { useResources } from '@/lib/hooks/use-resources'

interface SidebarGroupEditorProps {
	group: SidebarGroup
	index: number
	onUpdate: (group: SidebarGroup) => void
	onDelete: () => void
	onMove: (fromIndex: number, toIndex: number) => void
	totalGroups: number
	isExpanded: boolean
	onToggleExpanded: () => void
}

export function SidebarGroupEditor({
	group,
	index,
	onUpdate,
	onDelete,
	onMove,
	totalGroups,
	isExpanded,
	onToggleExpanded
}: SidebarGroupEditorProps) {
	const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
	const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false)
	const [itemToDelete, setItemToDelete] = useState<string | null>(null)
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

	// Fetch resources using TanStack Query
	const { data: availableResources = [], isLoading: loadingResources } = useResources()

	const updateField = (field: keyof SidebarGroup, value: any) => {
		onUpdate({ ...group, [field]: value })
	}

	const addItem = () => {
		const newItem: SidebarItem = {
			id: `item-${Date.now()}`,
			type: 'link',
			label: 'New Item',
			href: '#'
		}
		onUpdate({
			...group,
			items: [...group.items, newItem]
		})
		// Auto-expand the new item
		setExpandedItems(prev => new Set(prev).add(newItem.id))
	}

	const updateItem = (itemId: string, updatedItem: SidebarItem) => {
		onUpdate({
			...group,
			items: group.items.map(i => (i.id === itemId ? updatedItem : i))
		})
	}

	const handleDeleteItemClick = (itemId: string) => {
		setItemToDelete(itemId)
		setDeleteItemDialogOpen(true)
	}

	const handleDeleteItemConfirm = () => {
		if (itemToDelete) {
			onUpdate({
				...group,
				items: group.items.filter(i => i.id !== itemToDelete)
			})
			setItemToDelete(null)
		}
		setDeleteItemDialogOpen(false)
	}

	const handleDeleteGroupClick = () => {
		setDeleteGroupDialogOpen(true)
	}

	const handleDeleteGroupConfirm = () => {
		onDelete()
		setDeleteGroupDialogOpen(false)
	}

	const toggleItem = (itemId: string) => {
		setExpandedItems(prev => {
			const next = new Set(prev)
			if (next.has(itemId)) {
				next.delete(itemId)
			} else {
				next.add(itemId)
			}
			return next
		})
	}

	const addNestedItem = (parentItemId: string, newItem: SidebarItem) => {
		onUpdate({
			...group,
			items: group.items.map(item =>
				item.id === parentItemId && item.type === 'group'
					? { ...item, items: [...(item as any).items, newItem] }
					: item
			)
		})
	}

	const deleteNestedItem = (parentItemId: string, nestedItemId: string) => {
		onUpdate({
			...group,
			items: group.items.map(item =>
				item.id === parentItemId && item.type === 'group'
					? {
							...item,
							items: (item as any).items.filter(
								(i: SidebarItem) => i.id !== nestedItemId
							)
					  }
					: item
			)
		})
	}

	const updateNestedItem = (
		parentItemId: string,
		nestedItemId: string,
		updatedNestedItem: SidebarItem
	) => {
		onUpdate({
			...group,
			items: group.items.map(item =>
				item.id === parentItemId && item.type === 'group'
					? {
							...item,
							items: (item as any).items.map((i: SidebarItem) =>
								i.id === nestedItemId ? updatedNestedItem : i
							)
					  }
					: item
			)
		})
	}

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='sm'
						className='cursor-move'
						disabled={totalGroups === 1}
					>
						<GripVertical className='h-4 w-4' />
					</Button>

					<Button variant='ghost' size='sm' onClick={onToggleExpanded}>
						<ChevronRight
							className={`h-4 w-4 transition-transform ${
								isExpanded ? 'rotate-90' : ''
							}`}
						/>
					</Button>

					<div className='flex-1 min-w-0'>
						<Input
							value={group.title || ''}
							onChange={e => updateField('title', e.target.value)}
							placeholder='Group title (optional)'
						/>
					</div>

					<div className='w-24'>
						<Input
							type='number'
							value={group.maxItems || ''}
							onChange={e =>
								updateField(
									'maxItems',
									e.target.value ? parseInt(e.target.value) : undefined
								)
							}
							placeholder='Max items'
							min='1'
						/>
					</div>

					<div className='flex gap-1'>
						{index > 0 && (
							<Button
								variant='ghost'
								size='sm'
								onClick={() => onMove(index, index - 1)}
							>
								<ChevronUp className='h-4 w-4' />
							</Button>
						)}
						{index < totalGroups - 1 && (
							<Button
								variant='ghost'
								size='sm'
								onClick={() => onMove(index, index + 1)}
							>
								<ChevronDown className='h-4 w-4' />
							</Button>
						)}
						<Button
							variant='ghost'
							size='sm'
							className='text-destructive hover:text-destructive'
							onClick={handleDeleteGroupClick}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Label>Items</Label>
							<Button variant='outline' size='sm' onClick={addItem}>
								<Plus className='h-4 w-4 mr-2' />
								Add Item
							</Button>
						</div>

						<div className='space-y-4'>
							{group.items.map(item => {
								const isItemExpanded = expandedItems.has(item.id)

								return (
									<Card key={item.id}>
										<CardHeader>
											<div className='flex items-center gap-2'>
												<Button
													variant='ghost'
													size='sm'
													className='cursor-move'
												>
													<GripVertical className='h-4 w-4' />
												</Button>

												<Button
													variant='ghost'
													size='sm'
													onClick={() => toggleItem(item.id)}
												>
													<ChevronRight
														className={`h-4 w-4 transition-transform ${
															isItemExpanded ? 'rotate-90' : ''
														}`}
													/>
												</Button>

												<div className='flex-1 min-w-0'>
													<Input
														value={item.label || ''}
														onChange={e => {
															const updatedItem = {
																...item,
																label: e.target.value
															}
															updateItem(item.id, updatedItem)
														}}
														placeholder='Item name'
													/>
												</div>

												<Button
													variant='ghost'
													size='sm'
													className='text-destructive'
													onClick={() => handleDeleteItemClick(item.id)}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</CardHeader>

										{isItemExpanded && (
											<CardContent>
												<div className='space-y-4'>
													<div className='space-y-2'>
														<Label>Item Type</Label>
														<Select
															value={item.type}
															onValueChange={value => {
																let updatedItem: SidebarItem
																if (value === 'resource') {
																	updatedItem = {
																		id: item.id,
																		type: 'resource',
																		resourceId:
																			availableResources[0]
																				?.id || '1',
																		resourceName:
																			availableResources[0]
																				?.name || 'Unknown',
																		label: item.label,
																		icon: item.icon
																	}
																} else if (value === 'link') {
																	updatedItem = {
																		id: item.id,
																		type: 'link',
																		href: '#',
																		label:
																			item.label ||
																			'New Link',
																		icon: item.icon
																	}
																} else {
																	updatedItem = {
																		id: item.id,
																		type: 'group',
																		label:
																			item.label ||
																			'New Group',
																		items: [],
																		icon: item.icon
																	}
																}
																updateItem(item.id, updatedItem)
															}}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value='link'>
																	Link
																</SelectItem>
																<SelectItem value='resource'>
																	Resource
																</SelectItem>
																<SelectItem value='group'>
																	Group
																</SelectItem>
															</SelectContent>
														</Select>
													</div>

													{item.type === 'resource' && (
														<div className='space-y-2'>
															<Label>Resource</Label>
															<Select
																value={(item as any).resourceId}
																onValueChange={value => {
																	const resource =
																		availableResources.find(
																			r => r.id === value
																		)
																	const updatedItem = {
																		...item,
																		resourceId: value,
																		resourceName:
																			resource?.name ||
																			'Unknown',
																		label:
																			item.label ||
																			resource?.name
																	}
																	updateItem(item.id, updatedItem)
																}}
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
																	) : availableResources.length ===
																	  0 ? (
																		<div className='p-2 text-center text-sm text-muted-foreground'>
																			No resources available
																		</div>
																	) : (
																		availableResources.map(
																			resource => (
																				<SelectItem
																					key={
																						resource.id
																					}
																					value={
																						resource.id
																					}
																				>
																					{resource.name}
																				</SelectItem>
																			)
																		)
																	)}
																</SelectContent>
															</Select>
														</div>
													)}

													{item.type === 'link' && (
														<div className='space-y-2'>
															<Label>URL</Label>
															<Input
																value={(item as any).href || ''}
																onChange={e => {
																	const updatedItem = {
																		...item,
																		href: e.target.value
																	}
																	updateItem(item.id, updatedItem)
																}}
																placeholder='/admin/page'
															/>
														</div>
													)}

													<div className='space-y-2'>
														<Label>Icon (optional)</Label>
														<Select
															value={item.icon || 'none'}
															onValueChange={value => {
																const updatedItem = {
																	...item,
																	icon:
																		value === 'none'
																			? undefined
																			: value
																}
																updateItem(item.id, updatedItem)
															}}
														>
															<SelectTrigger>
																<SelectValue placeholder='Select an icon' />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value='none'>
																	None
																</SelectItem>
																{ICON_OPTIONS.map(option => (
																	<SelectItem
																		key={option.value}
																		value={option.value}
																	>
																		{option.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</div>

													{item.type === 'group' && (
														<div className='space-y-2'>
															<div className='flex items-center justify-between'>
																<Label>Nested Items</Label>
																<Button
																	variant='outline'
																	size='sm'
																	onClick={() => {
																		const newNestedItem: SidebarItem =
																			{
																				id: `item-${Date.now()}`,
																				type: 'link',
																				label: 'New Link',
																				href: '#'
																			}
																		addNestedItem(
																			item.id,
																			newNestedItem
																		)
																		// Auto-expand the new nested item
																		setExpandedItems(prev =>
																			new Set(prev).add(
																				newNestedItem.id
																			)
																		)
																	}}
																>
																	<Plus className='h-4 w-4 mr-2' />
																	Add nested item
																</Button>
															</div>

															<div className='space-y-2'>
																{((item as any).items || []).map(
																	(nestedItem: SidebarItem) => {
																		const isNestedItemExpanded =
																			expandedItems.has(
																				nestedItem.id
																			)
																		return (
																			<Card
																				key={nestedItem.id}
																			>
																				<CardHeader>
																					<div className='flex items-center gap-2'>
																						<Button
																							variant='ghost'
																							size='sm'
																							className='cursor-move'
																						>
																							<GripVertical className='h-4 w-4' />
																						</Button>

																						<Button
																							variant='ghost'
																							size='sm'
																							onClick={() =>
																								toggleItem(
																									nestedItem.id
																								)
																							}
																						>
																							<ChevronRight
																								className={`h-4 w-4 transition-transform ${
																									isNestedItemExpanded
																										? 'rotate-90'
																										: ''
																								}`}
																							/>
																						</Button>

																						<div className='flex-1 min-w-0'>
																							<Input
																								value={
																									nestedItem.label ||
																									''
																								}
																								onChange={e => {
																									const updatedNestedItem =
																										{
																											...nestedItem,
																											label: e
																												.target
																												.value
																										}
																									updateNestedItem(
																										item.id,
																										nestedItem.id,
																										updatedNestedItem
																									)
																								}}
																								placeholder='Item name'
																							/>
																						</div>

																						<Button
																							variant='ghost'
																							size='sm'
																							className='text-destructive'
																							onClick={() =>
																								deleteNestedItem(
																									item.id,
																									nestedItem.id
																								)
																							}
																						>
																							<Trash2 className='h-4 w-4' />
																						</Button>
																					</div>
																				</CardHeader>

																				{isNestedItemExpanded && (
																					<CardContent>
																						<div className='space-y-4'>
																							<div className='space-y-2'>
																								<Label>
																									Item
																									Type
																								</Label>
																								<Select
																									value={
																										nestedItem.type
																									}
																									onValueChange={value => {
																										let updatedNestedItem: SidebarItem
																										if (
																											value ===
																											'resource'
																										) {
																											updatedNestedItem =
																												{
																													id: nestedItem.id,
																													type: 'resource',
																													resourceId:
																														availableResources[0]
																															?.id ||
																														'1',
																													resourceName:
																														availableResources[0]
																															?.name ||
																														'Unknown',
																													label: nestedItem.label,
																													icon: nestedItem.icon
																												}
																										} else if (
																											value ===
																											'link'
																										) {
																											updatedNestedItem =
																												{
																													id: nestedItem.id,
																													type: 'link',
																													href: '#',
																													label:
																														nestedItem.label ||
																														'New Link',
																													icon: nestedItem.icon
																												}
																										} else {
																											updatedNestedItem =
																												{
																													id: nestedItem.id,
																													type: 'group',
																													label:
																														nestedItem.label ||
																														'New Group',
																													items: [],
																													icon: nestedItem.icon
																												}
																										}
																										updateNestedItem(
																											item.id,
																											nestedItem.id,
																											updatedNestedItem
																										)
																									}}
																								>
																									<SelectTrigger>
																										<SelectValue />
																									</SelectTrigger>
																									<SelectContent>
																										<SelectItem value='link'>
																											Link
																										</SelectItem>
																										<SelectItem value='resource'>
																											Resource
																										</SelectItem>
																										<SelectItem value='group'>
																											Group
																										</SelectItem>
																									</SelectContent>
																								</Select>
																							</div>

																							{nestedItem.type ===
																								'resource' && (
																								<div className='space-y-2'>
																									<Label>
																										Resource
																									</Label>
																									<Select
																										value={
																											(
																												nestedItem as any
																											)
																												.resourceId
																										}
																										onValueChange={value => {
																											const resource =
																												availableResources.find(
																													r =>
																														r.id ===
																														value
																												)
																											const updatedNestedItem =
																												{
																													...nestedItem,
																													resourceId:
																														value,
																													resourceName:
																														resource?.name ||
																														'Unknown',
																													label:
																														nestedItem.label ||
																														resource?.name
																												}
																											updateNestedItem(
																												item.id,
																												nestedItem.id,
																												updatedNestedItem
																											)
																										}}
																										disabled={
																											loadingResources
																										}
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
																											) : availableResources.length ===
																											  0 ? (
																												<div className='p-2 text-center text-sm text-muted-foreground'>
																													No
																													resources
																													available
																												</div>
																											) : (
																												availableResources.map(
																													resource => (
																														<SelectItem
																															key={
																																resource.id
																															}
																															value={
																																resource.id
																															}
																														>
																															{
																																resource.name
																															}
																														</SelectItem>
																													)
																												)
																											)}
																										</SelectContent>
																									</Select>
																								</div>
																							)}

																							{nestedItem.type ===
																								'link' && (
																								<div className='space-y-2'>
																									<Label>
																										URL
																									</Label>
																									<Input
																										value={
																											(
																												nestedItem as any
																											)
																												.href ||
																											''
																										}
																										onChange={e => {
																											const updatedNestedItem =
																												{
																													...nestedItem,
																													href: e
																														.target
																														.value
																												}
																											updateNestedItem(
																												item.id,
																												nestedItem.id,
																												updatedNestedItem
																											)
																										}}
																										placeholder='/admin/page'
																									/>
																								</div>
																							)}

																							<div className='space-y-2'>
																								<Label>
																									Icon
																									(optional)
																								</Label>
																								<Select
																									value={
																										nestedItem.icon ||
																										'none'
																									}
																									onValueChange={value => {
																										const updatedNestedItem =
																											{
																												...nestedItem,
																												icon:
																													value ===
																													'none'
																														? undefined
																														: value
																											}
																										updateNestedItem(
																											item.id,
																											nestedItem.id,
																											updatedNestedItem
																										)
																									}}
																								>
																									<SelectTrigger>
																										<SelectValue placeholder='Select an icon' />
																									</SelectTrigger>
																									<SelectContent>
																										<SelectItem value='none'>
																											None
																										</SelectItem>
																										{ICON_OPTIONS.map(
																											option => (
																												<SelectItem
																													key={
																														option.value
																													}
																													value={
																														option.value
																													}
																												>
																													{
																														option.label
																													}
																												</SelectItem>
																											)
																										)}
																									</SelectContent>
																								</Select>
																							</div>

																							{nestedItem.type ===
																								'group' && (
																								<div className='p-3 border rounded-md bg-muted/50'>
																									<p className='text-xs text-muted-foreground'>
																										⚠️
																										Nested
																										groups
																										within
																										groups
																										are
																										not
																										recommended
																										for
																										UI
																										simplicity.
																										Consider
																										using
																										a
																										top-level
																										group
																										instead.
																									</p>
																								</div>
																							)}
																						</div>
																					</CardContent>
																				)}
																			</Card>
																		)
																	}
																)}
															</div>
														</div>
													)}
												</div>
											</CardContent>
										)}
									</Card>
								)
							})}
						</div>
					</div>
				</CardContent>
			)}

			<AlertDialog open={deleteGroupDialogOpen} onOpenChange={setDeleteGroupDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Group</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this group? This will also delete all
							items within the group. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteGroupConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={deleteItemDialogOpen} onOpenChange={setDeleteItemDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Item</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this item? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteItemConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	)
}
