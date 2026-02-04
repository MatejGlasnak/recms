'use client'

import { Slider } from '@/components/ui/slider'

export const SliderField = ({
	value,
	onChange
}: {
	value: unknown
	onChange: (value: number) => void
}) => {
	const numValue = typeof value === 'number' ? value : 1
	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between'>
				<span className='text-sm font-medium'>Columns: {numValue}</span>
			</div>
			<Slider
				value={[numValue]}
				onValueChange={values => onChange(values[0])}
				min={1}
				max={12}
				step={1}
			/>
		</div>
	)
}
