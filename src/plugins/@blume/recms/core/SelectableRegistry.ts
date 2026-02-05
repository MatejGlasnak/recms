'use client'

/**
 * Global registry for managing selectable element callbacks
 * This allows components to register their onClick handlers without storing them in DOM
 */
class SelectableRegistry {
	private callbacks = new Map<string, () => void>()

	register(id: string, callback: () => void) {
		this.callbacks.set(id, callback)
	}

	unregister(id: string) {
		this.callbacks.delete(id)
	}

	trigger(id: string) {
		const callback = this.callbacks.get(id)
		if (callback) {
			callback()
		}
	}

	has(id: string): boolean {
		return this.callbacks.has(id)
	}

	clear() {
		this.callbacks.clear()
	}
}

// Export singleton instance
export const selectableRegistry = new SelectableRegistry()
