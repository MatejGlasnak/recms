import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAppResourcesCollection } from '@/lib/mongo'
import type { Resource } from '@/lib/types/resources'

const resourceSchema = z.object({
	name: z.string().min(1, 'Name is required'),
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

// GET - Fetch a single resource by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params
		const collection = await getAppResourcesCollection()
		const resource = await collection.findOne({ _id: id })

		if (!resource) {
			return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
		}

		const transformedResource: Resource = {
			id: resource._id,
			name: resource.name,
			endpoint: resource.endpoint,
			methods: resource.methods
		}

		return NextResponse.json(transformedResource)
	} catch (error) {
		console.error('Error fetching resource:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// PUT - Update a resource
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params
		const body = await request.json()

		// Validate input
		const validation = resourceSchema.safeParse(body)
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
		}

		const resourceData = validation.data
		const collection = await getAppResourcesCollection()

		// Check if resource exists
		const existingResource = await collection.findOne({ _id: id })
		if (!existingResource) {
			return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
		}

		// Check if another resource with same name already exists
		const duplicateResource = await collection.findOne({
			name: resourceData.name,
			_id: { $ne: id }
		})
		if (duplicateResource) {
			return NextResponse.json(
				{ error: 'Resource with this name already exists' },
				{ status: 409 }
			)
		}

		// Update resource
		const now = new Date()
		await collection.updateOne(
			{ _id: id },
			{
				$set: {
					...resourceData,
					updatedAt: now
				}
			}
		)

		const updatedResource: Resource = {
			id,
			...resourceData
		}

		return NextResponse.json(updatedResource)
	} catch (error) {
		console.error('Error updating resource:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// DELETE - Delete a resource
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params
		const collection = await getAppResourcesCollection()

		// Check if resource exists
		const existingResource = await collection.findOne({ _id: id })
		if (!existingResource) {
			return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
		}

		// Delete resource
		await collection.deleteOne({ _id: id })

		return NextResponse.json({ success: true, message: 'Resource deleted' })
	} catch (error) {
		console.error('Error deleting resource:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
