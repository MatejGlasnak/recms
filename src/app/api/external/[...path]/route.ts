import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy route for external API requests
 * This keeps the bearer token server-side and avoids CORS issues
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	return proxyRequest(request, await params, 'GET')
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	return proxyRequest(request, await params, 'POST')
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	return proxyRequest(request, await params, 'PUT')
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	return proxyRequest(request, await params, 'DELETE')
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	return proxyRequest(request, await params, 'PATCH')
}

const EXTERNAL_API_BEARER_HEADER = 'x-external-api-bearer-token'

async function proxyRequest(request: NextRequest, params: { path: string[] }, method: string) {
	const { path } = params
	const externalApiUrl = process.env.NEXT_PUBLIC_EXTERNAL_REST_URL
	const bearerToken =
		request.headers.get(EXTERNAL_API_BEARER_HEADER) ??
		request.headers.get('X-External-Api-Bearer-Token')

	if (!externalApiUrl) {
		return NextResponse.json({ error: 'External API URL not configured' }, { status: 500 })
	}

	// Construct the full URL
	const targetPath = path.join('/')
	const targetUrl = `${externalApiUrl}/${targetPath}`

	// Get query parameters from the original request
	const searchParams = request.nextUrl.searchParams
	const queryString = searchParams.toString()
	const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl

	try {
		// Prepare headers
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		// Add bearer token from client (stored in localStorage, sent in header)
		if (bearerToken) {
			headers['Authorization'] = `Bearer ${bearerToken}`
		}

		// Prepare fetch options
		const fetchOptions: RequestInit = {
			method,
			headers
		}

		// Add body for POST, PUT, PATCH requests
		if (method !== 'GET' && method !== 'DELETE') {
			const body = await request.text()
			if (body) {
				fetchOptions.body = body
			}
		}

		// Make the request to the external API
		const response = await fetch(fullUrl, fetchOptions)

		// Get response data
		const data = await response.text()

		// Parse JSON if possible
		let jsonData
		try {
			jsonData = JSON.parse(data)
		} catch {
			jsonData = data
		}

		// Return the response with the same status code
		return NextResponse.json(jsonData, {
			status: response.status,
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} catch (error) {
		console.error('Proxy error:', error)
		return NextResponse.json(
			{
				error: 'Failed to proxy request',
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		)
	}
}
