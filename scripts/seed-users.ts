/**
 * Script to seed initial users into the database
 * Usage: npm run seed:all
 */

import { hash } from 'bcryptjs'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recms'

interface User {
	email: string
	password: string
	name?: string
}

const initialUsers: User[] = [
	{
		email: 'testing@blume.sk',
		password: '1234567890',
		name: 'Test User'
	}
]

async function seedUsers() {
	console.log('🌱 Starting user seeding...')
	console.log('📦 Connecting to MongoDB...')

	const client = new MongoClient(MONGODB_URI)

	try {
		await client.connect()
		console.log('✅ Connected to MongoDB')

		const db = client.db()
		const usersCollection = db.collection('users')

		// Create unique index on email if it doesn't exist
		await usersCollection.createIndex({ email: 1 }, { unique: true })

		let created = 0
		let skipped = 0

		for (const user of initialUsers) {
			// Check if user already exists
			const existingUser = await usersCollection.findOne({ email: user.email })

			if (existingUser) {
				console.log(`⏭️  User ${user.email} already exists, skipping...`)
				skipped++
				continue
			}

			// Hash password
			const hashedPassword = await hash(user.password, 10)

			// Insert user
			const result = await usersCollection.insertOne({
				email: user.email,
				password: hashedPassword,
				name: user.name,
				createdAt: new Date(),
				updatedAt: new Date()
			})

			console.log(`✅ Created user: ${user.email} (ID: ${result.insertedId})`)
			created++
		}

		console.log('\n📊 Seeding Summary:')
		console.log(`   ✅ Created: ${created} users`)
		console.log(`   ⏭️  Skipped: ${skipped} users (already exist)`)
		console.log(`   📝 Total: ${initialUsers.length} users`)

		if (created > 0) {
			console.log('\n🎉 User seeding completed successfully!')
			console.log('\n📋 Available credentials:')
			initialUsers.forEach(user => {
				console.log(`   Email: ${user.email}`)
				console.log(`   Password: ${user.password}`)
				console.log('')
			})
		}
	} catch (error) {
		console.error('❌ Error seeding users:', error)
		process.exit(1)
	} finally {
		await client.close()
		console.log('🔌 MongoDB connection closed')
	}
}

seedUsers()
