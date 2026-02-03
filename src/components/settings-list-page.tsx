import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SettingsItem {
	title: string
	description?: string
	href: string
	icon?: React.ComponentType<{ className?: string }>
}

interface SettingsSection {
	title?: string
	description?: string
	items: SettingsItem[]
}

interface SettingsListPageProps {
	title: string
	description?: string
	sections: SettingsSection[]
}

export function SettingsListPage({ title, description, sections }: SettingsListPageProps) {
	return (
		<div className='flex flex-1 flex-col'>
			<div className='flex flex-col gap-4 p-4 md:p-6'>
				<div className='flex flex-col gap-1'>
					<h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
					{description && <p className='text-sm text-muted-foreground'>{description}</p>}
				</div>

				<div className='flex flex-col gap-4'>
					{sections.map((section, sectionIdx) => (
						<div key={sectionIdx} className='flex flex-col gap-3'>
							{section.title && (
								<div className='flex flex-col gap-0.5'>
									<h2 className='text-sm font-medium text-foreground'>
										{section.title}
									</h2>
									{section.description && (
										<p className='text-xs text-muted-foreground'>
											{section.description}
										</p>
									)}
								</div>
							)}

							<div className='grid gap-2'>
								{section.items.map((item, itemIdx) => {
									const Icon = item.icon
									return (
										<Link key={itemIdx} href={item.href}>
											<Card className='transition-colors hover:bg-accent cursor-pointer'>
												<CardHeader className='p-3'>
													<div className='flex items-center justify-between'>
														<div className='flex items-center gap-3 flex-1'>
															{Icon && (
																<Icon className='h-4 w-4 text-muted-foreground shrink-0' />
															)}
															<div className='flex flex-col gap-0.5'>
																<CardTitle className='text-sm font-medium'>
																	{item.title}
																</CardTitle>
																{item.description && (
																	<CardDescription className='text-xs'>
																		{item.description}
																	</CardDescription>
																)}
															</div>
														</div>
														<ChevronRight className='h-4 w-4 text-muted-foreground shrink-0' />
													</div>
												</CardHeader>
											</Card>
										</Link>
									)
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
