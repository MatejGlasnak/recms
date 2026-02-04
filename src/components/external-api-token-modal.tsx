'use client'

import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	getExternalApiBearerToken,
	setExternalApiBearerToken,
	removeExternalApiBearerToken
} from '@/lib/constants/external-api-token'
import { toast } from 'sonner'

interface ExternalApiTokenModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ExternalApiTokenModal({ open, onOpenChange }: ExternalApiTokenModalProps) {
	const [token, setToken] = useState('')

	useEffect(() => {
		if (open) {
			setToken(getExternalApiBearerToken() ?? '')
		}
	}, [open])

	const handleSave = () => {
		const trimmed = token.trim()
		if (trimmed) {
			setExternalApiBearerToken(trimmed)
			toast.success('External API token saved')
		} else {
			removeExternalApiBearerToken()
			toast.success('External API token removed')
		}
		onOpenChange(false)
	}

	const handleClear = () => {
		setToken('')
		removeExternalApiBearerToken()
		toast.success('External API token removed')
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>External API Bearer Token</DialogTitle>
					<DialogDescription>
						Enter the Bearer token used for the external API. It is stored in your
						browser only and sent with requests to the external API.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='token'>Bearer token</Label>
						<Input
							id='token'
							type='password'
							placeholder='Paste your token here'
							value={token}
							onChange={e => setToken(e.target.value)}
							autoComplete='off'
						/>
					</div>
				</div>
				<DialogFooter>
					{token.trim() ? (
						<Button type='button' variant='outline' onClick={handleClear}>
							Clear
						</Button>
					) : null}
					<Button type='button' onClick={handleSave}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
