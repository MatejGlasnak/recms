import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAppResourcesListsCollection } from '@/lib/mongo'

const filterOptionSchema = z.object({
	label: z.string(),
	value: z.string()
})

const filterConfigSchema = z.object({
	id: z.string(),
	type: z.enum(['input', 'select', 'combobox', 'checkbox']),
	label: z.string(),
	field: z.string(),
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

const columnConfigSchema = z.object({
	id: z.string(),
	field: z.string(),
	label: z.string(),
	type: z.enum(['text', 'date', 'number', 'badge', 'boolean', 'json']),
	enabledByDefault: z.boolean(),
	sortable: z.boolean(),
	width: z.number().optional(),
	badgeVariant: z.enum(['default', 'secondary', 'destructive', 'outline']).optional(),
	format: z.string().optional()
})

const listConfigSchema = z.object({
	meta: z
		.object({
			title: z.string().optional(),
			description: z.string().optional()
		})
		.optional(),
	columns: z.array(columnConfigSchema).optional(),
	filters: z.array(filterConfigSchema).optional()
})

// GET - Fetch list configuration for a specific resource
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string }> }
) {
	try {
		const { resourceId } = await params
		const collection = await getAppResourcesListsCollection()
		const config = await collection.findOne({ resourceId })

		if (!config) {
			// Return default config if none exists
			return NextResponse.json({
				id: null,
				resourceId,
				meta: {},
				columns: [],
				filters: []
			})
		}

		return NextResponse.json({
			id: config._id,
			resourceId: config.resourceId,
			meta: config.meta || {},
			columns: config.columns || [],
			filters: config.filters || []
		})
	} catch (error) {
		console.error('Error fetching list config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// PATCH - Update list configuration for a specific resource
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string }> }
) {
	try {
		const { resourceId } = await params
		const body = await request.json()

		// Validate input
		const validation = listConfigSchema.safeParse(body)
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
		}

		const configData = validation.data
		const collection = await getAppResourcesListsCollection()

		// Check if config exists
		const existingConfig = await collection.findOne({ resourceId })

		if (existingConfig) {
			// Update existing config
			await collection.updateOne(
				{ resourceId },
				{
					$set: {
						...configData,
						updatedAt: new Date()
					}
				}
			)

			return NextResponse.json({
				id: existingConfig._id,
				resourceId,
				...configData
			})
		} else {
			// Create new config
			const id = crypto.randomUUID()
			const now = new Date()
			await collection.insertOne({
				_id: id,
				resourceId,
				...configData,
				createdAt: now,
				updatedAt: now
			} as any)

			return NextResponse.json(
				{
					id,
					resourceId,
					...configData
				},
				{ status: 201 }
			)
		}
	} catch (error) {
		console.error('Error updating list config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// DELETE - Delete list configuration for a specific resource
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string }> }
) {
	try {
		const { resourceId } = await params
		const collection = await getAppResourcesListsCollection()

		const result = await collection.deleteOne({ resourceId })

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Config not found' }, { status: 404 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting list config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
