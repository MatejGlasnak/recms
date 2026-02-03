import { NextRequest, NextResponse } from 'next/server'
import { getAppSidebarConfigCollection } from '@/lib/mongo'
import type { SidebarConfig } from '@/lib/types/sidebar-config'

const CONFIG_ID = 'default'

// GET - Fetch sidebar configuration
export async function GET() {
	try {
		const collection = await getAppSidebarConfigCollection()
		const configDoc = await collection.findOne({ _id: CONFIG_ID })

		if (!configDoc) {
			// Return default empty configuration
			const defaultConfig: SidebarConfig = {
				groups: []
			}
			return NextResponse.json(defaultConfig)
		}

		return NextResponse.json(configDoc.config)
	} catch (error) {
		console.error('Error fetching sidebar config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// PUT - Update sidebar configuration
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		const config: SidebarConfig = body

		// Basic validation
		if (!config || !Array.isArray(config.groups)) {
			return NextResponse.json({ error: 'Invalid configuration format' }, { status: 400 })
		}

		const collection = await getAppSidebarConfigCollection()
		const now = new Date()

		// Upsert the configuration
		await collection.updateOne(
			{ _id: CONFIG_ID },
			{
				$set: {
					config,
					updatedAt: now
				}
			},
			{ upsert: true }
		)

		return NextResponse.json({ success: true, config })
	} catch (error) {
		console.error('Error updating sidebar config:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
