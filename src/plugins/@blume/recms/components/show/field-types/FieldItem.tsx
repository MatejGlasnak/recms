'use client'

import type { ShowItem } from '../../../types'
import { TextField } from './TextField'
import { NumberField } from './NumberField'
import { DateField } from './DateField'
import { RichTextField } from './RichTextField'

interface FieldItemProps {
	item: ShowItem
	value: unknown
	label: string
}

export function FieldItem({ item, value, label }: FieldItemProps) {
	switch (item.type) {
		case 'text':
			return <TextField item={item} value={value} label={label} />
		case 'number':
			return <NumberField item={item} value={value} label={label} />
		case 'date':
			return <DateField item={item} value={value} label={label} />
		case 'richtext':
			return <RichTextField item={item} value={value} label={label} />
		default:
			return <TextField item={item} value={value} label={label} />
	}
}
