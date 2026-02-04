import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/auth'
import { getUsersCollection } from '@/lib/mongo'

export async function GET() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const usersCollection = await getUsersCollection()
		const user = await usersCollection.findOne(
			{ _id: session.user.id },
			{ projection: { password: 0 } }
		)
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		const displayName = [user.name, user.surname].filter(Boolean).join(' ') || user.email
		return NextResponse.json({
			id: user._id.toString(),
			email: user.email,
			name: user.name ?? null,
			surname: user.surname ?? null,
			displayName
		})
	} catch (error) {
		console.error('Error fetching current user:', error)
		return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
	}
}
