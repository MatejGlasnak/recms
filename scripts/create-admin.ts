/**
 * Script to create an admin user
 * Usage: npx tsx scripts/create-admin.ts <email> <password>
 */

async function createAdmin() {
	const email = process.argv[2]
	const password = process.argv[3]

	if (!email || !password) {
		console.error('Usage: npx tsx scripts/create-admin.ts <email> <password>')
		process.exit(1)
	}

	try {
		const response = await fetch('http://localhost:3000/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})

		if (!response.ok) {
			const error = await response.json()
			console.error('Error creating admin:', error)
			process.exit(1)
		}

		const user = await response.json()
		console.log('Admin user created successfully!')
		console.log('Email:', user.email)
		console.log('ID:', user._id)
	} catch (error) {
		console.error('Failed to create admin:', error)
		process.exit(1)
	}
}

createAdmin()
