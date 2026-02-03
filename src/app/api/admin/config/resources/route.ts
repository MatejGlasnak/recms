import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAppResourcesCollection } from '@/lib/mongo'
import type { Resource } from '@/lib/types/resources'

const resourceSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	label: z.string().min(1, 'Label is required'),
	endpoint: z.string().min(1, 'Endpoint is required'),
	methods: z
		.array(
			z.object({
				method: z.enum(['GET', 'POST', 'PATCH', 'PUT', 'DELETE']),
				path: z.string(),
				description: z.string().optional()
			})
		)
		.optional()
})

// GET - Fetch all resources
export async function GET() {
	try {
		const collection = await getAppResourcesCollection()
		const resources = await collection.find({}).toArray()

		// Transform _id to id for frontend
		const transformedResources = resources.map(resource => ({
			id: resource._id,
			name: resource.name,
			label: resource.label,
			endpoint: resource.endpoint,
			methods: resource.methods
		}))

		return NextResponse.json(transformedResources)
	} catch (error) {
		console.error('Error fetching resources:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// POST - Create a new resource
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// Validate input
		const validation = resourceSchema.safeParse(body)
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
		}

		const resourceData = validation.data

		const collection = await getAppResourcesCollection()

		// Check if resource with same name already exists
		const existingResource = await collection.findOne({ name: resourceData.name })
		if (existingResource) {
			return NextResponse.json(
				{ error: 'Resource with this name already exists' },
				{ status: 409 }
			)
		}

		// Create resource
		const now = new Date()
		const id = crypto.randomUUID()
		await collection.insertOne({
			_id: id,
			...resourceData,
			createdAt: now,
			updatedAt: now
		} as any)

		const newResource: Resource = {
			id,
			...resourceData
		}

		return NextResponse.json(newResource, { status: 201 })
	} catch (error) {
		console.error('Error creating resource:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
