'use client'

import { SettingsListPage } from '@/components/settings-list-page'
import { Settings } from 'lucide-react'
import { usePageSetup } from '@/lib/contexts/page-context'

export default function SettingsPage() {
	usePageSetup('Settings', [{ label: 'Settings' }])

	return (
		<SettingsListPage
			title='Settings'
			description='Manage your application settings and preferences'
			sections={[
				{
					items: [
						{
							title: 'Configuration',
							description: 'Configure application resources and integrations',
							href: '/admin/settings/configuration',
							icon: Settings
						}
					]
				}
			]}
		/>
	)
}
