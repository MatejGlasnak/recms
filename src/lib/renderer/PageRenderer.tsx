import { LayoutNode } from '@/lib/schema/layout'

export function PageRenderer({ nodes }: { nodes: LayoutNode[] }) {
	return (
		<>
			{nodes.map(node => {
				switch (node.type) {
					case 'table':
						return <div key={node.id}>Table</div>
					case 'form':
						return <div key={node.id}>Form</div>
					case 'tabs':
						return (
							<div key={node.id}>
								<PageRenderer nodes={node.children ?? []} />
							</div>
						)
					default:
						return null
				}
			})}
		</>
	)
}
