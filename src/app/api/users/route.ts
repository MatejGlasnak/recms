import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { getUsersCollection } from '@/lib/mongo'
import { CreateUserInput, UserWithoutPassword } from '@/lib/types/user'

const createUserSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()

		// Validate input
		const validation = createUserSchema.safeParse(body)
		if (!validation.success) {
			return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 })
		}

		const { email, password } = validation.data as CreateUserInput

		// Check if user already exists
		const usersCollection = await getUsersCollection()
		const existingUser = await usersCollection.findOne({ email })

		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 409 }
			)
		}

		// Hash password
		const hashedPassword = await hash(password, 10)

		// Create user
		const now = new Date()
		const result = await usersCollection.insertOne({
			_id: crypto.randomUUID(),
			email,
			password: hashedPassword,
			createdAt: now,
			updatedAt: now
		} as any)

		// Return user without password
		const userWithoutPassword: UserWithoutPassword = {
			_id: result.insertedId.toString(),
			email,
			createdAt: now,
			updatedAt: now
		}

		return NextResponse.json(userWithoutPassword, { status: 201 })
	} catch (error) {
		console.error('Error creating user:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function GET() {
	try {
		const usersCollection = await getUsersCollection()
		const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray()

		return NextResponse.json(users)
	} catch (error) {
		console.error('Error fetching users:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
