import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAppResourcesListsCollection, getAppResourcesShowPagesCollection } from '@/lib/mongo'

const blockConfigSchema = z.object({
	id: z.string(),
	slug: z.string(),
	labels: z.record(z.string(), z.string()).optional(),
	config: z.record(z.string(), z.unknown()),
	visible: z.boolean().optional(),
	order: z.number().optional()
})

const pageConfigSchema = z.object({
	blocks: z.array(blockConfigSchema)
})

// GET - Fetch page configuration for a specific resource
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string[] }> }
) {
	try {
		const { resourceId: resourceIdArray } = await params

		// Join array segments: ['blog-categories', 'show'] -> 'blog-categories/show'
		const resourceId = resourceIdArray.join('/')

		// Check if this is a show page (resourceId ends with /show)
		const isShowPage = resourceId.endsWith('/show')
		const actualResourceId = isShowPage ? resourceId.replace('/show', '') : resourceId

		const collection = isShowPage
			? await getAppResourcesShowPagesCollection()
			: await getAppResourcesListsCollection()

		const config = await collection.findOne({ resourceId: actualResourceId })

		if (!config) {
			// Return default block-based config
			if (isShowPage) {
				return NextResponse.json({
					id: null,
					resourceId: actualResourceId,
					blocks: [
						{
							id: 'header-1',
							slug: 'show-header',
							config: {
								title: '',
								description: '',
								showEdit: true,
								showDelete: false,
								showBack: true
							},
							order: 0
						},
						{
							id: 'tabs-1',
							slug: 'tabs',
							config: {
								tabs: [
									{
										id: 'general',
										label: 'General',
										blocks: []
									}
								],
								defaultTab: 'general',
								orientation: 'horizontal',
								variant: 'default',
								registryType: 'field'
							},
							order: 1
						}
					]
				})
			} else {
				return NextResponse.json({
					id: null,
					resourceId,
					blocks: [
						{
							id: 'header-1',
							slug: 'list-header',
							config: {
								title: '',
								description: '',
								showEditButton: true
							}
						},
						{
							id: 'filters-1',
							slug: 'list-filters',
							config: {
								filters: []
							}
						},
						{
							id: 'table-1',
							slug: 'list-table',
							config: {
								columns: [],
								rowClickAction: 'none'
							}
						},
						{
							id: 'pagination-1',
							slug: 'list-pagination',
							config: {
								pageSize: 10,
								pageSizeOptions: [10, 25, 50, 100]
							}
						}
					]
				})
			}
		}

		// Check if config has new block structure
		if (config.blocks) {
			return NextResponse.json({
				id: config._id,
				resourceId: actualResourceId,
				blocks: config.blocks
			})
		}

		// Convert legacy config to block structure
		const blocks = []

		// Header block from meta
		if (config.meta?.title || config.meta?.description) {
			blocks.push({
				id: 'header-1',
				slug: 'list-header',
				config: {
					title: config.meta?.title ?? '',
					description: config.meta?.description ?? '',
					showEditButton: true
				}
			})
		}

		// Filters block
		if (config.filters && config.filters.length > 0) {
			blocks.push({
				id: 'filters-1',
				slug: 'list-filters',
				config: {
					filters: config.filters
				}
			})
		}

		// Table block
		blocks.push({
			id: 'table-1',
			slug: 'list-table',
			config: {
				columns: config.columns || [],
				rowClickAction: config.rowClickAction ?? 'none'
			}
		})

		// Pagination block
		blocks.push({
			id: 'pagination-1',
			slug: 'list-pagination',
			config: {
				pageSize: 10,
				pageSizeOptions: [10, 25, 50, 100]
			}
		})

		return NextResponse.json({
			id: config._id,
			resourceId: config.resourceId,
			blocks
		})
	} catch (error) {
		console.error('Error fetching page config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// PATCH - Update page configuration for a specific resource
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string[] }> }
) {
	try {
		const { resourceId: resourceIdArray } = await params
		const body = await request.json()

		// Join array segments: ['blog-categories', 'show'] -> 'blog-categories/show'
		const resourceId = resourceIdArray.join('/')

		// Check if this is a show page (resourceId ends with /show)
		const isShowPage = resourceId.endsWith('/show')
		const actualResourceId = isShowPage ? resourceId.replace('/show', '') : resourceId

		// Validate input
		const validation = pageConfigSchema.safeParse(body)
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
		}

		const configData = validation.data
		const collection = isShowPage
			? await getAppResourcesShowPagesCollection()
			: await getAppResourcesListsCollection()

		// Check if config exists
		const existingConfig = await collection.findOne({ resourceId: actualResourceId })

		if (existingConfig) {
			// Update existing config
			await collection.updateOne(
				{ resourceId: actualResourceId },
				{
					$set: {
						blocks: configData.blocks,
						updatedAt: new Date()
					}
				}
			)

			return NextResponse.json({
				id: existingConfig._id,
				resourceId: actualResourceId,
				blocks: configData.blocks
			})
		} else {
			// Create new config
			const id = crypto.randomUUID()
			const now = new Date()
			await collection.insertOne({
				_id: id,
				resourceId: actualResourceId,
				blocks: configData.blocks,
				createdAt: now,
				updatedAt: now
			} as any)

			return NextResponse.json(
				{
					id,
					resourceId: actualResourceId,
					blocks: configData.blocks
				},
				{ status: 201 }
			)
		}
	} catch (error) {
		console.error('Error updating page config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// DELETE - Delete page configuration for a specific resource
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string[] }> }
) {
	try {
		const { resourceId: resourceIdArray } = await params

		// Join array segments: ['blog-categories', 'show'] -> 'blog-categories/show'
		const resourceId = resourceIdArray.join('/')

		// Check if this is a show page (resourceId ends with /show)
		const isShowPage = resourceId.endsWith('/show')
		const actualResourceId = isShowPage ? resourceId.replace('/show', '') : resourceId

		const collection = isShowPage
			? await getAppResourcesShowPagesCollection()
			: await getAppResourcesListsCollection()

		const result = await collection.deleteOne({ resourceId: actualResourceId })

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Config not found' }, { status: 404 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting page config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
