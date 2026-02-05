import type { BlockFieldConfig } from '@blume/recms-core'

export const editHeaderConfig: BlockFieldConfig = {
	fields: [
		{
			name: 'title',
			type: 'text',
			label: 'Title',
			comment: 'Custom title for the edit page header'
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description',
			comment: 'Optional description text below the title'
		},
		{
			name: 'showSave',
			type: 'switch',
			label: 'Show Save Button',
			comment: 'Display the save button in the header'
		},
		{
			name: 'showCancel',
			type: 'switch',
			label: 'Show Cancel Button',
			comment: 'Display the cancel button in the header'
		},
		{
			name: 'showBack',
			type: 'switch',
			label: 'Show Back Button',
			comment: 'Display the back button in the header'
		}
	]
}
