export interface User {
	_id: string
	email: string
	password: string // hashed
	name?: string
	surname?: string
	createdAt: Date
	updatedAt: Date
}

export interface CreateUserInput {
	email: string
	password: string
}

export interface UserSession {
	id: string
	email: string
}

export type UserWithoutPassword = Omit<User, 'password'>
