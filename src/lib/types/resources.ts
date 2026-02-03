export interface Resource {
	id: string
	name: string
	label: string
	endpoint: string
	methods?: ResourceMethod[]
}

export interface ResourceMethod {
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
	path: string
	description?: string
}

export interface ResourceFormData {
	name: string
	label: string
	endpoint: string
}
