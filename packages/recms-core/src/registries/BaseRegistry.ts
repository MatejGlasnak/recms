/**
 * Base Registry
 *
 * Provides unified API for all registry types (blocks, columns, fields, filters)
 * while maintaining type safety for each specific registry.
 */

import { useEffect } from 'react'

export interface BaseRegistryItem {
	slug: string
	Component: React.ComponentType<any>
	config?: any
	label?: string
	description?: string
}

export interface RegistryHooks<T extends BaseRegistryItem> {
	register: (item: T) => void
	unregister: (slug: string) => void
	get: (slug: string) => T | undefined
	getAll: () => T[]
	has: (slug: string) => boolean
}

/**
 * Creates a unified registry with common operations
 */
export function createRegistry<T extends BaseRegistryItem>() {
	const items = new Map<string, T>()

	const register = (item: T): void => {
		if (!item.slug) {
			console.error('Registry item must have a slug', item)
			return
		}
		items.set(item.slug, item)
	}

	const unregister = (slug: string): void => {
		items.delete(slug)
	}

	const get = (slug: string): T | undefined => {
		return items.get(slug)
	}

	const getAll = (): T[] => {
		return Array.from(items.values())
	}

	const has = (slug: string): boolean => {
		return items.has(slug)
	}

	return {
		items,
		register,
		unregister,
		get,
		getAll,
		has
	}
}

/**
 * Hook to register an item in a registry
 * Automatically unregisters on unmount
 */
export function useRegisterItem<T extends BaseRegistryItem>(
	item: T,
	register: (item: T) => void,
	unregister: (slug: string) => void
): void {
	useEffect(() => {
		if (item && item.slug) {
			register(item)
			return () => {
				unregister(item.slug)
			}
		}
	}, [item, register, unregister])
}
