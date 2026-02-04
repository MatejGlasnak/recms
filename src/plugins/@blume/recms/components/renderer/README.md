# Block Renderer

This directory contains the independent `BlockRenderer` component that is responsible for rendering blocks based on their configuration.

## Overview

The `BlockRenderer` is a completely independent component that:

1. Takes a block configuration object
2. Looks up the corresponding block component from the BlockRegistry
3. Renders the component with all necessary props
4. Handles errors gracefully when a block type is not registered

## Architecture

The BlockRenderer follows the **Strategy Pattern** where:
- The renderer acts as a context that delegates rendering to specific block components
- Block components are registered in the BlockRegistry
- The renderer is completely decoupled from any specific page implementation

## Components

### BlockRenderer

The main renderer component that maps block configurations to their corresponding React components.

**Props:**
- `block: BlockConfig` - The block configuration to render
- `data?: unknown[]` - Optional data to pass to the block
- `isLoading?: boolean` - Loading state
- `editMode?: boolean` - Whether the block is in edit mode
- `resourceId?: string` - The resource ID for resource-specific blocks
- `onConfigUpdate?: (blockId: string, config: Record<string, unknown>) => Promise<void>` - Callback for updating block configuration
- `additionalProps?: Record<string, unknown>` - Any additional props to pass to the block component

## Usage

```tsx
import { BlockRenderer } from '@/plugins/@blume/recms/components/renderer'
import type { BlockConfig } from '@/plugins/@blume/recms/types/block-config'

function MyPage() {
  const blockConfig: BlockConfig = {
    id: 'header-1',
    slug: 'list-header',
    config: {
      title: 'My List'
    }
  }

  return (
    <BlockRenderer
      block={blockConfig}
      data={myData}
      isLoading={false}
      editMode={false}
      resourceId="users"
    />
  )
}
```

## Benefits of Independence

1. **Reusability** - Can be used in any page type (list, show, edit, etc.)
2. **Testability** - Easy to test in isolation
3. **Maintainability** - Single responsibility, changes are localized
4. **Extensibility** - New block types can be added without modifying the renderer
5. **Type Safety** - Fully typed interfaces for all props

## Error Handling

If a block type is not registered in the BlockRegistry, the renderer will:
1. Log a warning to the console
2. Display an error alert to the user
3. Continue rendering other blocks without crashing

## Integration with BlockRegistry

The renderer depends on the `BlockRegistry` context. Ensure your page is wrapped with `BlockRegistryProvider`:

```tsx
import { BlockRegistryProvider } from '@/plugins/@blume/recms/components/registry'
import { BlockRenderer } from '@/plugins/@blume/recms/components/renderer'

function App() {
  return (
    <BlockRegistryProvider>
      {/* Your blocks will render here */}
      <BlockRenderer block={config} />
    </BlockRegistryProvider>
  )
}
```

## Future Enhancements

Potential improvements for the renderer:

- **Lazy loading** - Load block components on demand
- **Error boundaries** - Wrap each block in an error boundary
- **Performance monitoring** - Track render times for each block
- **Block animations** - Add enter/exit animations
- **Block skeleton** - Show skeleton UI while blocks are loading
