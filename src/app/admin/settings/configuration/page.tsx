'use client'

import { SettingsListPage } from '@/components/settings-list-page'
import { Database, PanelLeft } from 'lucide-react'
import { usePageSetup } from '@/lib/contexts/page-context'

export default function ConfigurationPage() {
	usePageSetup('Configuration', [
		{ label: 'Settings', href: '/admin/settings' },
		{ label: 'Configuration' }
	])

	return (
		<SettingsListPage
			title='Configuration'
			description='Configure application resources and integrations'
			sections={[
				{
					title: 'Layout',
					description: 'Configure the application layout and navigation',
					items: [
						{
							title: 'Sidebar',
							description: 'Configure sidebar navigation structure',
							href: '/admin/settings/configuration/sidebar',
							icon: PanelLeft
						}
					]
				},
				{
					title: 'Advanced',
					description: 'Advanced configuration options',
					items: [
						{
							title: 'Resources',
							description: 'Manage external API resources for the admin panel',
							href: '/admin/settings/configuration/resources',
							icon: Database
						}
					]
				}
			]}
		/>
	)
}
