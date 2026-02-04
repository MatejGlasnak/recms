import type { BlockFieldConfig } from '../../../core/registries/types'

export const showHeaderConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'general',
			type: 'group',
			label: 'General Settings',
			columns: 6,
			fields: [
				{
					name: 'title',
					type: 'text',
					label: 'Page Title',
					placeholder: 'Auto-generated from resource',
					comment: 'Override the default page title',
					span: 6
				},
				{
					name: 'description',
					type: 'textarea',
					label: 'Page Description',
					placeholder: 'Auto-generated description',
					comment: 'Override the default page description',
					span: 6
				}
			]
		},
		{
			name: 'actions',
			type: 'group',
			label: 'Action Buttons',
			columns: 6,
			fields: [
				{
					name: 'showEdit',
					type: 'switch',
					label: 'Show Edit Button',
					default: true,
					comment: 'Display edit button in header',
					span: 2
				},
				{
					name: 'showDelete',
					type: 'switch',
					label: 'Show Delete Button',
					default: false,
					comment: 'Display delete button in header',
					span: 2
				},
				{
					name: 'showBack',
					type: 'switch',
					label: 'Show Back Button',
					default: true,
					comment: 'Display back to list button',
					span: 2
				}
			]
		}
	]
}
