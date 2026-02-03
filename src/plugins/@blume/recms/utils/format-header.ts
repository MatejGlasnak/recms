export function formatHeader(key: string): string {
	return key
		.replace(/([A-Z])/g, ' $1')
		.replace(/_/g, ' ')
		.replace(/^./, str => str.toUpperCase())
		.trim()
}
