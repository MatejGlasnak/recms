import {
	Home,
	Settings,
	Users,
	Database,
	FileText,
	Folder,
	BarChart,
	Mail,
	Calendar,
	ShoppingCart,
	type LucideIcon
} from 'lucide-react'

export const AVAILABLE_ICONS: Record<string, LucideIcon> = {
	home: Home,
	settings: Settings,
	users: Users,
	database: Database,
	fileText: FileText,
	folder: Folder,
	barChart: BarChart,
	mail: Mail,
	calendar: Calendar,
	shoppingCart: ShoppingCart
}

export const ICON_OPTIONS = Object.keys(AVAILABLE_ICONS).map(key => ({
	value: key,
	label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
}))
