export function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
	const pages: (number | string)[] = []
	const maxVisiblePages = 5

	if (totalPages <= maxVisiblePages) {
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i)
		}
	} else {
		pages.push(1)

		if (currentPage > 3) {
			pages.push('...')
		}

		const start = Math.max(2, currentPage - 1)
		const end = Math.min(totalPages - 1, currentPage + 1)

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		if (currentPage < totalPages - 2) {
			pages.push('...')
		}

		if (totalPages > 1) {
			pages.push(totalPages)
		}
	}

	return pages
}
