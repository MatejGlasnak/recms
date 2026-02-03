'use client'

import { useEffect, useState, useRef } from 'react'
import { usePageSetup } from '@/lib/contexts/page-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Save, Loader2 } from 'lucide-react'
import type { SidebarConfig, SidebarGroup } from '@/lib/types/sidebar-config'
import { SidebarGroupEditor } from '@/components/sidebar-config/sidebar-group-editor'
import { useSidebarConfigQuery, useUpdateSidebarConfig } from '@/lib/hooks/use-sidebar-config'

export default function SidebarConfigPage() {
	usePageSetup('Sidebar', [
		{ label: 'Settings', href: '/admin/settings' },
		{ label: 'Configuration', href: '/admin/settings/configuration' },
		{ label: 'Sidebar' }
	])

	const { data: fetchedConfig, isLoading } = useSidebarConfigQuery()
	const updateMutation = useUpdateSidebarConfig()
	
	const [config, setConfig] = useState<SidebarConfig>({ groups: [] })
	const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set())
	const hasSyncedRef = useRef(false)
	
	// Initialize local config from fetched data once
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (fetchedConfig && !hasSyncedRef.current) {
			hasSyncedRef.current = true
			setConfig(fetchedConfig)
			setExpandedGroups(new Set(fetchedConfig.groups.map(g => g.id)))
		}
		// Dependencies intentionally minimal - we only want to sync once on initial load
	}, [fetchedConfig])

	const addGroup = () => {
		const newGroup: SidebarGroup = {
			id: `group-${Date.now()}`,
			title: 'New Group',
			maxItems: undefined,
			items: []
		}
		setConfig({
			...config,
			groups: [...config.groups, newGroup]
		})
		// Auto-expand the new group
		setExpandedGroups(prev => new Set(prev).add(newGroup.id))
	}

	const toggleGroupExpanded = (groupId: string) => {
		setExpandedGroups(prev => {
			const next = new Set(prev)
			if (next.has(groupId)) {
				next.delete(groupId)
			} else {
				next.add(groupId)
			}
			return next
		})
	}

	const collapseAll = () => {
		setExpandedGroups(new Set())
	}

	const expandAll = () => {
		setExpandedGroups(new Set(config.groups.map(g => g.id)))
	}

	const allExpanded = config.groups.length > 0 && expandedGroups.size === config.groups.length

	const updateGroup = (groupId: string, updatedGroup: SidebarGroup) => {
		setConfig({
			...config,
			groups: config.groups.map(g => (g.id === groupId ? updatedGroup : g))
		})
	}

	const deleteGroup = (groupId: string) => {
		setConfig({
			...config,
			groups: config.groups.filter(g => g.id !== groupId)
		})
	}

	const moveGroup = (fromIndex: number, toIndex: number) => {
		const newGroups = [...config.groups]
		const [removed] = newGroups.splice(fromIndex, 1)
		newGroups.splice(toIndex, 0, removed)
		setConfig({ ...config, groups: newGroups })
	}

	const handleSave = () => {
		updateMutation.mutate(config, {
			onSuccess: () => {
				// Reset sync flag so we can sync with updated server data
				hasSyncedRef.current = false
			}
		})
	}

	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex flex-col gap-4 p-4 md:p-6'>
				<div className='flex items-start justify-between gap-4'>
					<div className='flex flex-col gap-1'>
						<h1 className='text-2xl font-semibold tracking-tight'>
							Sidebar Configuration
						</h1>
						<p className='text-sm text-muted-foreground'>
							Configure the sidebar navigation structure
						</p>
					</div>
					<div className='flex gap-2'>
						<Button
							size='sm'
							variant='outline'
							onClick={handleSave}
							disabled={updateMutation.isPending || isLoading}
						>
							{updateMutation.isPending ? (
								<Loader2 className='h-4 w-4 mr-2 animate-spin' />
							) : (
								<Save className='h-4 w-4 mr-2' />
							)}
							{updateMutation.isPending ? 'Saving...' : 'Save'}
						</Button>
						<Button size='sm' onClick={addGroup} disabled={isLoading}>
							<Plus className='h-4 w-4 mr-2' />
							Add Group
						</Button>
					</div>
				</div>

				<div className='flex flex-col gap-3'>
					<div className='flex items-center justify-between'>
						<h2 className='text-sm font-medium'>Groups</h2>
						{config.groups.length > 0 && (
							<Button
								variant='ghost'
								size='sm'
								className='h-7 text-xs'
								onClick={allExpanded ? collapseAll : expandAll}
							>
								{allExpanded ? 'Collapse all' : 'Expand all'}
							</Button>
						)}
					</div>

					{isLoading ? (
						<Card className='p-8 flex items-center justify-center'>
							<Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
						</Card>
					) : (
						<>
							{config.groups.map((group, index) => (
								<SidebarGroupEditor
									key={group.id}
									group={group}
									index={index}
									onUpdate={updatedGroup => updateGroup(group.id, updatedGroup)}
									onDelete={() => deleteGroup(group.id)}
									onMove={moveGroup}
									totalGroups={config.groups.length}
									isExpanded={expandedGroups.has(group.id)}
									onToggleExpanded={() => toggleGroupExpanded(group.id)}
								/>
							))}

							{config.groups.length === 0 && (
								<Card className='p-8 flex items-center justify-center'>
									<p className='text-sm text-muted-foreground'>
										No groups yet. Click &ldquo;Add Group&rdquo; to create one.
									</p>
								</Card>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
