import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAppResourcesShowCollection } from '@/lib/mongo'

const showItemTypeSchema = z.enum(['number', 'date', 'text', 'richtext'])
const showItemSchema = z.object({
	field: z.string(),
	type: showItemTypeSchema,
	label: z.string().optional(),
	colspan: z.number().min(1).max(12).optional()
})
const showGroupSchema = z.object({
	label: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	columns: z.number().min(1).max(8).optional(),
	columnItems: z.array(z.array(showItemSchema)).optional(),
	items: z.array(showItemSchema).optional()
})
const showTabSchema = z.object({
	label: z.string(),
	showLabel: z.string().optional(),
	description: z.string().optional(),
	groups: z.array(showGroupSchema)
})

const showConfigSchema = z.object({
	showFieldOrder: z.array(z.string()).optional(),
	showTabs: z.boolean().optional(),
	tabs: z.array(showTabSchema).optional(),
	defaultGroups: z.array(showGroupSchema).optional()
})

// GET - Fetch show configuration for a specific resource
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string }> }
) {
	try {
		const { resourceId } = await params
		const collection = await getAppResourcesShowCollection()
		const config = await collection.findOne({ resourceId })

		if (!config) {
			return NextResponse.json({
				id: null,
				resourceId,
				showFieldOrder: [],
				showTabs: true,
				tabs: undefined,
				defaultGroups: undefined
			})
		}

		return NextResponse.json({
			id: config._id,
			resourceId: config.resourceId,
			showFieldOrder: config.showFieldOrder ?? [],
			showTabs: config.showTabs ?? true,
			tabs: config.tabs ?? undefined,
			defaultGroups: config.defaultGroups ?? undefined
		})
	} catch (error) {
		console.error('Error fetching show config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// PATCH - Update show configuration for a specific resource
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ resourceId: string }> }
) {
	try {
		const { resourceId } = await params
		const body = await request.json()

		const validation = showConfigSchema.safeParse(body)
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
		}

		const configData = validation.data
		const collection = await getAppResourcesShowCollection()
		const existingConfig = await collection.findOne({ resourceId })

		if (existingConfig) {
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
		}

		const id = crypto.randomUUID()
		const now = new Date()
		await collection.insertOne({
			_id: id,
			resourceId,
			...configData,
			createdAt: now,
			updatedAt: now
		} as any)
		return NextResponse.json({ id, resourceId, ...configData }, { status: 201 })
	} catch (error) {
		console.error('Error updating show config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
