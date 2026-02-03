'use client'

import { useQuery, gql } from '@apollo/client'
import { PageRenderer } from '@/lib/renderer/PageRenderer'

const PAGE_QUERY = gql`
	query Page($slug: String!) {
		page(slug: $slug) {
			id
			slug
			layout
		}
	}
`

export default function AdminPage({ params }: { params: { slug: string } }) {
	const { data, loading, error } = useQuery(PAGE_QUERY, {
		variables: { slug: params.slug }
	})

	if (loading) return <div>Loading...</div>
	if (error || !data?.page) return <div>Not found</div>

	return <PageRenderer nodes={JSON.parse(data.page.layout)} />
}
