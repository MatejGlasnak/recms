import { ApolloServer } from 'apollo-server-micro'
import { gql } from 'graphql-tag'
import clientPromise from '@/lib/mongo'
import { NextRequest, NextResponse } from 'next/server'

// Define schema
const typeDefs = gql`
	type AdminPage {
		id: ID!
		slug: String!
		resource: String!
		layout: String!
		permissions: [String!]!
		version: Int!
		status: String!
	}

	type Query {
		pages: [AdminPage!]!
		page(slug: String!): AdminPage
	}

	type Mutation {
		createPage(
			slug: String!
			resource: String!
			layout: String!
			permissions: [String!]!
		): AdminPage!
	}
`

// Define resolvers
const resolvers = {
	Query: {
		pages: async () => {
			const client = await clientPromise
			const db = client.db()
			return db.collection('adminPages').find().toArray()
		},
		page: async (_: any, { slug }: { slug: string }) => {
			const client = await clientPromise
			const db = client.db()
			return db.collection('adminPages').findOne({ slug })
		}
	},
	Mutation: {
		createPage: async (_: any, args: any) => {
			const client = await clientPromise
			const db = client.db()
			const result = await db.collection('adminPages').insertOne({
				...args,
				version: 1,
				status: 'DRAFT',
				createdAt: new Date(),
				updatedAt: new Date()
			})
			return { id: result.insertedId, ...args, version: 1, status: 'DRAFT' }
		}
	}
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const GET = async (req: NextRequest) => {
	return NextResponse.json({ message: 'Use POST for GraphQL queries' })
}

export const POST = async (req: NextRequest) => {
	const body = await req.json()
	const response = await apolloServer.executeOperation(body)
	return NextResponse.json(response)
}
