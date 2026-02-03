import graphqlDataProvider from '@refinedev/graphql'

export const externalDataProvider = graphqlDataProvider({
	url: process.env.NEXT_PUBLIC_BUSINESS_GQL_URL!,
	fetch: (url, options) =>
		fetch(url, {
			...options,
			credentials: 'include'
		})
})
