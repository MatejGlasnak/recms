import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PageProvider } from '@/lib/contexts/page-context'
import { SidebarConfigProvider } from '@/lib/contexts/sidebar-config-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarConfigProvider>
			<SidebarProvider>
				<AppSidebar variant='inset' />
				<SidebarInset>
					<PageProvider>
						<SiteHeader />
						{children}
					</PageProvider>
				</SidebarInset>
			</SidebarProvider>
		</SidebarConfigProvider>
	)
}
