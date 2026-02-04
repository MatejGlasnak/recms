'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Pencil, Trash2, Plus, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import type { TabItem } from './types'

export interface TabsEditorProps {
	value: TabItem[]
	onChange: (value: TabItem[]) => void
	field?: unknown
}

export function TabsEditor({ value = [], onChange }: TabsEditorProps) {
	const [editingTab, setEditingTab] = useState<TabItem | null>(null)
	const [editingIndex, setEditingIndex] = useState<number>(-1)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [tabLabel, setTabLabel] = useState('')

	const handleAddTab = () => {
		setEditingTab({
			id: `tab-${Date.now()}`,
			label: '',
			blocks: []
		})
		setTabLabel('')
		setEditingIndex(-1)
		setIsDialogOpen(true)
	}

	const handleEditTab = (index: number) => {
		const tab = value[index]
		setEditingTab({ ...tab })
		setTabLabel(tab.label)
		setEditingIndex(index)
		setIsDialogOpen(true)
	}

	const handleSaveTab = () => {
		if (!editingTab || !tabLabel.trim()) return

		const updatedTab = { ...editingTab, label: tabLabel.trim() }
		const newTabs = [...value]

		if (editingIndex >= 0) {
			newTabs[editingIndex] = updatedTab
		} else {
			newTabs.push(updatedTab)
		}

		onChange(newTabs)
		setIsDialogOpen(false)
		setEditingTab(null)
		setEditingIndex(-1)
		setTabLabel('')
	}

	const handleDeleteTab = (index: number) => {
		const newTabs = value.filter((_, i) => i !== index)
		onChange(newTabs)
	}

	const handleMoveTab = (index: number, direction: 'up' | 'down') => {
		const newTabs = [...value]
		const targetIndex = direction === 'up' ? index - 1 : index + 1

		if (targetIndex < 0 || targetIndex >= newTabs.length) return
		;[newTabs[index], newTabs[targetIndex]] = [newTabs[targetIndex], newTabs[index]]
		onChange(newTabs)
	}

	return (
		<div className='space-y-3'>
			<div className='space-y-2'>
				{value.map((tab, index) => (
					<div
						key={tab.id}
						className='flex items-center gap-2 rounded-md border border-border bg-background p-3'
					>
						<GripVertical className='h-4 w-4 text-muted-foreground' />
						<div className='flex-1'>
							<div className='font-medium'>{tab.label}</div>
							<div className='text-xs text-muted-foreground'>
								ID: {tab.id} • {tab.blocks.length} block(s)
							</div>
						</div>
						<div className='flex items-center gap-1'>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => handleMoveTab(index, 'up')}
								disabled={index === 0}
							>
								<ArrowUp className='h-4 w-4' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => handleMoveTab(index, 'down')}
								disabled={index === value.length - 1}
							>
								<ArrowDown className='h-4 w-4' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => handleEditTab(index)}
							>
								<Pencil className='h-4 w-4' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => handleDeleteTab(index)}
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					</div>
				))}
			</div>

			<Button onClick={handleAddTab} variant='outline' size='sm' className='w-full'>
				<Plus className='h-4 w-4 mr-2' />
				Add Tab
			</Button>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{editingIndex >= 0 ? 'Edit Tab' : 'Add Tab'}</DialogTitle>
						<DialogDescription>
							Configure the tab label. Blocks can be managed in the main view.
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-4 py-4'>
						<div className='space-y-2'>
							<Label htmlFor='tabLabel'>Tab Label</Label>
							<Input
								id='tabLabel'
								value={tabLabel}
								onChange={e => setTabLabel(e.target.value)}
								placeholder='e.g., General, Details, Advanced'
							/>
						</div>
						{editingTab && (
							<div className='text-sm text-muted-foreground'>
								Tab ID: {editingTab.id}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant='outline' onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveTab} disabled={!tabLabel.trim()}>
							{editingIndex >= 0 ? 'Save' : 'Add'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
