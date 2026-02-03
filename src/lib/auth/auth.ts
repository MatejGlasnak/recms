import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { getUsersCollection } from '../mongo'

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Email and password required')
				}

				const usersCollection = await getUsersCollection()
				const user = await usersCollection.findOne({
					email: credentials.email
				})

				if (!user) {
					throw new Error('Invalid credentials')
				}

				const isPasswordValid = await compare(credentials.password, user.password)

				if (!isPasswordValid) {
					throw new Error('Invalid credentials')
				}

				return {
					id: user._id.toString(),
					email: user.email
				}
			}
		})
	],
	session: {
		strategy: 'jwt'
	},
	pages: {
		signIn: '/auth/login'
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.email = user.email
			}
			return token
		},
		async session({ session, token }) {
			if (token && session.user) {
				;(session.user as any).id = token.id as string
				session.user.email = token.email as string
			}
			return session
		}
	}
}
