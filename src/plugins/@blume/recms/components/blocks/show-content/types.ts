export interface ShowFieldConfig {
	id: string
	field: string
	label?: string
	type: 'text' | 'number' | 'date' | 'richtext' | 'boolean' | 'badge' | 'json'
	colspan?: number
	format?: string
	badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
}
