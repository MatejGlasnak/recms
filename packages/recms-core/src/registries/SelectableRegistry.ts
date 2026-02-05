/**
 * SelectableRegistry
 * Centralized registry for selectable element callbacks
 * Used by the useSelectableSystem hook to manage click handlers
 */

type CallbackFn = () => void

class SelectableRegistry {
	private callbacks = new Map<string, CallbackFn>()

	/**
	 * Register a callback with a specific ID
	 * @param id - The unique identifier for this callback
	 * @param callback - The callback function to register
	 */
	register(id: string, callback: CallbackFn): void {
		this.callbacks.set(id, callback)
	}

	/**
	 * Unregister a callback by ID
	 */
	unregister(id: string): void {
		this.callbacks.delete(id)
	}

	/**
	 * Trigger a callback by ID
	 */
	trigger(id: string): void {
		const callback = this.callbacks.get(id)
		if (callback) {
			callback()
		}
	}

	/**
	 * Clear all registered callbacks
	 */
	clear(): void {
		this.callbacks.clear()
	}
}

// Export singleton instance
export const selectableRegistry = new SelectableRegistry()
