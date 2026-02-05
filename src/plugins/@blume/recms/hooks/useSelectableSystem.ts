'use client'

import { useEffect, type RefObject } from 'react'
import { selectableRegistry } from '../core/SelectableRegistry'

/**
 * Hook that sets up the centralized selectable system
 * Handles click and hover events for all elements with data-recms-selectable
 *
 * @param containerRef - Reference to the container element that should handle selectable events
 * @param enabled - Whether the system is enabled (typically tied to editMode)
 */
export function useSelectableSystem(
	containerRef: RefObject<HTMLElement | null>,
	enabled: boolean = true
) {
	useEffect(() => {
		if (!enabled || !containerRef.current) return

		const container = containerRef.current

		/**
		 * Click handler - finds the deepest selectable element and triggers its callback
		 */
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement

			// Check if click is on an ignored element (e.g., modal, tab buttons)
			const ignoredElement = target.closest('[data-recms-ignore="true"]')
			if (ignoredElement) return

			// Find the closest selectable element (this will be the deepest one)
			const selectable = target.closest('[data-recms-selectable]')
			if (selectable) {
				// Stop propagation to prevent parent handlers from firing
				e.stopPropagation()

				// Get the callback ID and trigger it
				const callbackId = selectable.getAttribute('data-recms-callback-id')
				if (callbackId) {
					selectableRegistry.trigger(callbackId)
				}
			}
		}

		/**
		 * Mouse over handler - adds hover state to the deepest selectable element
		 * Removes hover state from all other elements
		 */
		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement

			// Check if hovering over an ignored element
			const ignoredElement = target.closest('[data-recms-ignore="true"]')
			if (ignoredElement) {
				// Remove all hover states when over ignored elements
				container
					.querySelectorAll('[data-recms-hover="true"]')
					.forEach(el => el.removeAttribute('data-recms-hover'))
				return
			}

			// Find the closest selectable element (deepest one)
			const selectable = target.closest('[data-recms-selectable]')

			// Remove hover from all elements first
			container
				.querySelectorAll('[data-recms-hover="true"]')
				.forEach(el => el.removeAttribute('data-recms-hover'))

			// Add hover to the deepest selectable element only
			if (selectable) {
				selectable.setAttribute('data-recms-hover', 'true')
			}
		}

		/**
		 * Mouse leave handler - removes all hover states when leaving the container
		 */
		const handleMouseLeave = () => {
			container
				.querySelectorAll('[data-recms-hover="true"]')
				.forEach(el => el.removeAttribute('data-recms-hover'))
		}

		// Attach listeners with capture phase to intercept events early
		container.addEventListener('click', handleClick, true)
		container.addEventListener('mouseover', handleMouseOver, true)
		container.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			container.removeEventListener('click', handleClick, true)
			container.removeEventListener('mouseover', handleMouseOver, true)
			container.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [containerRef, enabled])
}
