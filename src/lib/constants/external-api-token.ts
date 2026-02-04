export const EXTERNAL_API_BEARER_TOKEN_KEY = 'external_api_bearer_token'

export function getExternalApiBearerToken(): string | null {
	if (typeof window === 'undefined') return null
	return localStorage.getItem(EXTERNAL_API_BEARER_TOKEN_KEY)
}

export function setExternalApiBearerToken(token: string): void {
	if (typeof window === 'undefined') return
	localStorage.setItem(EXTERNAL_API_BEARER_TOKEN_KEY, token)
}

export function removeExternalApiBearerToken(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem(EXTERNAL_API_BEARER_TOKEN_KEY)
}
