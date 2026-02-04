import { useQuery } from '@tanstack/react-query'

export interface CurrentUser {
	id: string
	email: string
	name: string | null
	surname: string | null
	displayName: string
}

async function fetchCurrentUser(): Promise<CurrentUser> {
	const response = await fetch('/api/user/me')
	if (!response.ok) {
		if (response.status === 401) {
			throw new Error('Unauthorized')
		}
		throw new Error('Failed to fetch current user')
	}
	return response.json()
}

export const currentUserKeys = {
	all: ['current-user'] as const,
	me: () => [...currentUserKeys.all, 'me'] as const
}

export function useCurrentUser() {
	return useQuery({
		queryKey: currentUserKeys.me(),
		queryFn: fetchCurrentUser,
		retry: false,
		staleTime: 5 * 60 * 1000 // 5 minutes
	})
}
