import { DataProvider } from '@refinedev/core'
import axios, { AxiosInstance } from 'axios'

// Create axios instance that uses our Next.js API proxy
// This avoids CORS issues and keeps the bearer token server-side
const axiosInstance: AxiosInstance = axios.create({
	baseURL: '/api/external',
	headers: {
		'Content-Type': 'application/json'
	}
})

export const externalDataProvider: DataProvider = {
	getList: async ({ resource, meta, pagination, sorters, filters }) => {
		// Use endpoint from meta if available, otherwise fall back to resource name
		const endpoint = meta?.endpoint || resource

		// Build query parameters
		const params = new URLSearchParams()

		// Add pagination parameters
		if (pagination) {
			const page = (pagination as any).current || (pagination as any).page || 1
			const perPage = (pagination as any).pageSize || (pagination as any).perPage || 10
			params.append('pagination[page]', String(page))
			params.append('pagination[perPage]', String(perPage))
		}

		// Add sorting parameters
		if (sorters && sorters.length > 0) {
			const sorter = sorters[0] // Use first sorter
			params.append('sort[field]', sorter.field)
			params.append('sort[order]', sorter.order === 'asc' ? 'asc' : 'desc')
		}

		// Add filter parameters
		if (filters && filters.length > 0) {
			filters.forEach((filter, index) => {
				if ('field' in filter && filter.field && filter.value !== undefined) {
					params.append(`filters[${index}][field]`, String(filter.field))
					params.append(`filters[${index}][operator]`, String(filter.operator || 'eq'))
					params.append(`filters[${index}][value]`, String(filter.value))
				}
			})
		}

		const queryString = params.toString()
		const url = queryString ? `/${endpoint}?${queryString}` : `/${endpoint}`

		const response = await axiosInstance.get(url)
		const data = response.data

		return {
			data: Array.isArray(data) ? data : data.data || [],
			total: data.meta?.total || data.total || (Array.isArray(data) ? data.length : 0)
		}
	},
	getOne: async ({ resource, id, meta }) => {
		// Use endpoint from meta if available, otherwise fall back to resource name
		const endpoint = meta?.endpoint || resource

		const response = await axiosInstance.get(`/${endpoint}/${id}`)
		const data = response.data

		return { data }
	},
	create: async ({ resource, variables, meta }) => {
		// Use endpoint from meta if available, otherwise fall back to resource name
		const endpoint = meta?.endpoint || resource

		const response = await axiosInstance.post(`/${endpoint}`, variables)
		const data = response.data

		return { data }
	},
	update: async ({ resource, id, variables, meta }) => {
		// Use endpoint from meta if available, otherwise fall back to resource name
		const endpoint = meta?.endpoint || resource

		const response = await axiosInstance.put(`/${endpoint}/${id}`, variables)
		const data = response.data

		return { data }
	},
	deleteOne: async ({ resource, id, meta }) => {
		// Use endpoint from meta if available, otherwise fall back to resource name
		const endpoint = meta?.endpoint || resource

		const response = await axiosInstance.delete(`/${endpoint}/${id}`)
		const data = response.data

		return { data }
	},
	getApiUrl: () => '/api/external'
}
