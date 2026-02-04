import { MongoClient, Db, Collection } from 'mongodb'
import { User } from './types/user'
import { Resource } from './types/resources'
import { SidebarConfig } from './types/sidebar-config'

const uri = process.env.MONGODB_URI!
if (!uri) throw new Error('Please define MONGODB_URI in .env')

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
	// allow global cache of the MongoClient in dev
	// to prevent multiple connections in hot reload
	var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
	// In dev, use global variable to prevent multiple connections
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri)
		global._mongoClientPromise = client.connect()
	}
	clientPromise = global._mongoClientPromise
} else {
	// In production, create new client
	client = new MongoClient(uri)
	clientPromise = client.connect()
}

export default clientPromise

// Helper to get database
export async function getDatabase(): Promise<Db> {
	const client = await clientPromise
	return client.db()
}

// Helper to get users collection
export async function getUsersCollection(): Promise<Collection<User>> {
	const db = await getDatabase()
	return db.collection<User>('users')
}

// Helper to get admin pages collection
export async function getAdminPagesCollection(): Promise<Collection> {
	const db = await getDatabase()
	return db.collection('adminPages')
}

// Helper to get app resources collection (for storing resource configurations)
export async function getAppResourcesCollection(): Promise<
	Collection<Resource & { _id: string; createdAt: Date; updatedAt: Date }>
> {
	const db = await getDatabase()
	return db.collection('app_resources')
}

// Helper to get app sidebar config collection (for storing sidebar configuration)
export async function getAppSidebarConfigCollection(): Promise<
	Collection<{ _id: string; config: SidebarConfig; updatedAt: Date }>
> {
	const db = await getDatabase()
	return db.collection('app_sidebar_config')
}

// Helper to get app resources lists collection (for storing list page configurations)
export async function getAppResourcesListsCollection(): Promise<Collection> {
	const db = await getDatabase()
	return db.collection('app_resources_lists')
}

// Helper to get app resources show config collection (for storing show page configurations)
export async function getAppResourcesShowCollection(): Promise<Collection> {
	const db = await getDatabase()
	return db.collection('app_resources_show')
}
