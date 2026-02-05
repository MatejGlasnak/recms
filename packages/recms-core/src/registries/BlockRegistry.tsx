'use client'

import React, { createContext, useContext, useMemo, useEffect, type ReactNode } from 'react'
import type { BlockDefinition } from './types'

interface BlockRegistryContextValue {
	blocks: Map<string, BlockDefinition>
	registerBlock: (definition: BlockDefinition) => void
	unregisterBlock: (slug: string) => void
	getBlock: (slug: string) => BlockDefinition | undefined
}

const BlockRegistryContext = createContext<BlockRegistryContextValue | null>(null)

export function BlockRegistryProvider({ children }: { children: ReactNode }) {
	const [blocks] = React.useState(() => new Map<string, BlockDefinition>())

	const registerBlock = React.useCallback(
		(definition: BlockDefinition) => {
			blocks.set(definition.slug, definition)
		},
		[blocks]
	)

	const unregisterBlock = React.useCallback(
		(slug: string) => {
			blocks.delete(slug)
		},
		[blocks]
	)

	const getBlock = React.useCallback(
		(slug: string) => {
			return blocks.get(slug)
		},
		[blocks]
	)

	// Note: Built-in blocks are registered in @blume/recms package
	// This keeps recms-core UI-agnostic
	useEffect(() => {
		// No auto-registration here - moved to @blume/recms
	}, [registerBlock])

	const value = useMemo(
		() => ({
			blocks,
			registerBlock,
			unregisterBlock,
			getBlock
		}),
		[blocks, registerBlock, unregisterBlock, getBlock]
	)

	return <BlockRegistryContext.Provider value={value}>{children}</BlockRegistryContext.Provider>
}

export function useBlockRegistry() {
	const context = useContext(BlockRegistryContext)
	if (!context) {
		throw new Error('useBlockRegistry must be used within BlockRegistryProvider')
	}
	return context
}

export function useRegisterBlock(definition: BlockDefinition) {
	const { registerBlock, unregisterBlock } = useBlockRegistry()

	React.useEffect(() => {
		registerBlock(definition)
		return () => {
			unregisterBlock(definition.slug)
		}
	}, [definition, registerBlock, unregisterBlock])
}

export function useBlock(slug: string) {
	const { getBlock } = useBlockRegistry()
	return getBlock(slug)
}
