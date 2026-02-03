'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Loader2,
	Plus,
	Trash2,
	GripVertical,
	ChevronRight,
	ChevronUp,
	ChevronDown
} from 'lucide-react'
import { useUpdateListConfig } from '../../../hooks'
import type { ListConfig } from '../../../types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

const filterOptionSchema = z.object({
	label: z.string().min(1, 'Label is required'),
	value: z.string().min(1, 'Value is required')
})

const filterSchema = z.object({
	id: z.string(),
	type: z.enum(['input', 'select', 'combobox', 'checkbox']),
	label: z.string().min(1, 'Label is required'),
	field: z.string().min(1, 'Field is required'),
	operator: z
		.enum([
			'eq',
			'ne',
			'contains',
			'startsWith',
			'endsWith',
			'gt',
			'gte',
			'lt',
			'lte',
			'in',
			'nin'
		])
		.optional(),
	placeholder: z.string().optional(),
	options: z.array(filterOptionSchema).optional(),
	defaultValue: z.union([z.string(), z.boolean(), z.array(z.string())]).optional(),
	multiple: z.boolean().optional()
})

const formSchema = z.object({
	filters: z.array(filterSchema)
})

type FormValues = z.infer<typeof formSchema>

export interface ListFiltersEditorProps {
	resourceId: string
	currentConfig: ListConfig | undefined
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ListFiltersEditor({
	resourceId,
	currentConfig,
	open,
	onOpenChange
}: ListFiltersEditorProps) {
	const updateMutation = useUpdateListConfig(resourceId)
	const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { filters: [] }
	})

	const { fields, append, remove, move } = useFieldArray({
		control: form.control,
		name: 'filters'
	})

	const toggleFilter = (filterId: string) => {
		setExpandedFilters(prev => {
			const next = new Set(prev)
			if (next.has(filterId)) next.delete(filterId)
			else next.add(filterId)
			return next
		})
	}

	useEffect(() => {
		if (open && currentConfig) {
			form.reset({ filters: currentConfig.filters || [] })
		}
	}, [open, currentConfig, form])

	const onSubmit = async (values: FormValues) => {
		try {
			await updateMutation.mutateAsync({ filters: values.filters })
			onOpenChange(false)
		} catch (error) {
			console.error('Error updating filters:', error)
		}
	}

	const addFilter = () => {
		const newId = crypto.randomUUID()
		append({
			id: newId,
			type: 'input',
			label: '',
			field: '',
			operator: 'contains',
			placeholder: '',
			options: [],
			multiple: false
		})
		setExpandedFilters(prev => new Set(prev).add(newId))
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[1000px] max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Configure Filters</DialogTitle>
					<DialogDescription>
						Add and configure filters for this list page. Filters help users narrow down
						the results.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						{fields.length === 0 ? (
							<div className='text-center py-8 text-muted-foreground'>
								No filters configured yet. Click &quot;Add Filter&quot; to get
								started.
							</div>
						) : (
							<div className='space-y-4'>
								{fields.map((field, index) => (
									<FilterEditorRow
										key={field.id}
										form={form}
										index={index}
										onRemove={() => remove(index)}
										onMove={(fromIndex, toIndex) => move(fromIndex, toIndex)}
										totalFilters={fields.length}
										isExpanded={expandedFilters.has(field.id)}
										onToggleExpanded={() => toggleFilter(field.id)}
									/>
								))}
							</div>
						)}

						<Button
							type='button'
							variant='outline'
							onClick={addFilter}
							className='w-full'
						>
							<Plus className='h-4 w-4 mr-2' />
							Add Filter
						</Button>

						<Separator />

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
								disabled={updateMutation.isPending}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={updateMutation.isPending}>
								{updateMutation.isPending && (
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								)}
								Save Changes
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

interface FilterEditorRowProps {
	form: ReturnType<typeof useForm<FormValues>>
	index: number
	onRemove: () => void
	onMove: (fromIndex: number, toIndex: number) => void
	totalFilters: number
	isExpanded: boolean
	onToggleExpanded: () => void
}

function FilterEditorRow({
	form,
	index,
	onRemove,
	onMove,
	totalFilters,
	isExpanded,
	onToggleExpanded
}: FilterEditorRowProps) {
	const filterType = form.watch(`filters.${index}.type`)
	const filterLabel = form.watch(`filters.${index}.label`)
	const {
		fields: optionFields,
		append: appendOption,
		remove: removeOption
	} = useFieldArray({
		control: form.control,
		name: `filters.${index}.options`
	})

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center gap-2'>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='cursor-move'
						disabled={totalFilters === 1}
					>
						<GripVertical className='h-4 w-4' />
					</Button>

					<Button type='button' variant='ghost' size='sm' onClick={onToggleExpanded}>
						<ChevronRight
							className={`h-4 w-4 transition-transform ${
								isExpanded ? 'rotate-90' : ''
							}`}
						/>
					</Button>

					<div className='flex-1 min-w-0'>
						<Input
							value={filterLabel || ''}
							onChange={e => form.setValue(`filters.${index}.label`, e.target.value)}
							placeholder='Filter label (e.g., Status, Category)'
						/>
					</div>

					<div className='w-36'>
						<Select
							value={filterType}
							onValueChange={value =>
								form.setValue(
									`filters.${index}.type`,
									value as 'input' | 'select' | 'combobox' | 'checkbox'
								)
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='input'>Input</SelectItem>
								<SelectItem value='select'>Select</SelectItem>
								<SelectItem value='combobox'>Combobox</SelectItem>
								<SelectItem value='checkbox'>Checkbox</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='flex gap-1'>
						{index > 0 && (
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={() => onMove(index, index - 1)}
							>
								<ChevronUp className='h-4 w-4' />
							</Button>
						)}
						{index < totalFilters - 1 && (
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={() => onMove(index, index + 1)}
							>
								<ChevronDown className='h-4 w-4' />
							</Button>
						)}
						<Button
							type='button'
							variant='ghost'
							size='sm'
							className='text-destructive hover:text-destructive'
							onClick={onRemove}
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</CardHeader>

			{isExpanded && (
				<CardContent>
					<div className='grid grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name={`filters.${index}.field`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Field Name</FormLabel>
									<FormControl>
										<Input
											placeholder='e.g., status, category, isActive'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name={`filters.${index}.operator`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Operator</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select operator' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='eq'>Equals (eq)</SelectItem>
											<SelectItem value='ne'>Not Equals (ne)</SelectItem>
											<SelectItem value='contains'>Contains</SelectItem>
											<SelectItem value='startsWith'>Starts With</SelectItem>
											<SelectItem value='endsWith'>Ends With</SelectItem>
											<SelectItem value='gt'>Greater Than (gt)</SelectItem>
											<SelectItem value='gte'>
												Greater Than or Equal (gte)
											</SelectItem>
											<SelectItem value='lt'>Less Than (lt)</SelectItem>
											<SelectItem value='lte'>
												Less Than or Equal (lte)
											</SelectItem>
											<SelectItem value='in'>In (in)</SelectItem>
											<SelectItem value='nin'>Not In (nin)</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{(filterType === 'input' ||
							filterType === 'select' ||
							filterType === 'combobox') && (
							<FormField
								control={form.control}
								name={`filters.${index}.placeholder`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Placeholder (Optional)</FormLabel>
										<FormControl>
											<Input
												placeholder='e.g., Search by name, Select a category'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{filterType === 'combobox' && (
							<FormField
								control={form.control}
								name={`filters.${index}.multiple`}
								render={({ field }) => (
									<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>Allow Multiple Selections</FormLabel>
										</div>
									</FormItem>
								)}
							/>
						)}

						{(filterType === 'select' || filterType === 'combobox') && (
							<div className='col-span-2 space-y-3'>
								<FormLabel>Options</FormLabel>
								{optionFields.length === 0 ? (
									<div className='text-sm text-muted-foreground'>
										No options added yet.
									</div>
								) : (
									<div className='space-y-2'>
										{optionFields.map((optionField, optionIndex) => (
											<div key={optionField.id} className='flex gap-2'>
												<FormField
													control={form.control}
													name={`filters.${index}.options.${optionIndex}.label`}
													render={({ field }) => (
														<FormItem className='flex-1'>
															<FormControl>
																<Input
																	placeholder='Label'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`filters.${index}.options.${optionIndex}.value`}
													render={({ field }) => (
														<FormItem className='flex-1'>
															<FormControl>
																<Input
																	placeholder='Value'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Button
													type='button'
													variant='ghost'
													size='icon'
													onClick={() => removeOption(optionIndex)}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										))}
									</div>
								)}
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => appendOption({ label: '', value: '' })}
								>
									<Plus className='h-4 w-4 mr-2' />
									Add Option
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			)}
		</Card>
	)
}
