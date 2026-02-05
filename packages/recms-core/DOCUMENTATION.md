# @blume/recms-core Documentation

## Overview

`@blume/recms-core` provides the core infrastructure for ReCMS without any UI dependencies. It includes providers, registries, configuration management, and type definitions.

## Installation

```bash
npm install @blume/recms-core
# or
pnpm add @blume/recms-core
```

## Core Concepts

### 1. Providers

Providers wrap your application and provide context for the entire ReCMS system.

#### RecmsProvider

The main provider that wraps all registry providers and configuration.

```typescript
import { RecmsProvider } from '@blume/recms-core'

function App({ children }) {
  return (
    <RecmsProvider config={recmsConfig}>
      {children}
    </RecmsProvider>
  )
}
```

### 2. Registries

Registries manage different types of components (blocks, columns, fields, filters).

#### BlockRegistry

Manages page-level blocks (headers, tables, filters, etc.).

```typescript
import { useBlockRegistry } from '@blume/recms-core'

function MyComponent() {
  const { registerBlock, getBlock } = useBlockRegistry()

  // Register a custom block
  registerBlock({
    slug: 'my-block',
    Component: MyBlock,
    config: myBlockConfig,
    label: 'My Block'
  })

  // Get a block
  const block = getBlock('my-block')
}
```

#### ColumnRegistry

Manages table column types.

```typescript
import { useColumnRegistry } from '@blume/recms-core'

function MyComponent() {
  const { registerColumn, getColumn } = useColumnRegistry()

  registerColumn({
    slug: 'status-badge',
    Component: StatusBadge,
    config: statusConfig,
    label: 'Status Badge'
  })
}
```

#### FieldRegistry

Manages form field types.

```typescript
import { useFieldRegistry } from '@blume/recms-core'

function MyComponent() {
  const { registerField, getField } = useFieldRegistry()

  registerField({
    type: 'rich-editor',
    Component: RichEditor,
    label: 'Rich Text Editor'
  })
}
```

#### FilterRegistry

Manages filter components for list pages.

```typescript
import { useFilterRegistry } from '@blume/recms-core'

function MyComponent() {
  const { registerFilter, getFilter } = useFilterRegistry()

  registerFilter({
    slug: 'date-range',
    Component: DateRangeFilter,
    config: dateRangeConfig,
    label: 'Date Range'
  })
}
```

### 3. Unified Registry API

All registries share a common API through the `BaseRegistry`:

```typescript
interface RegistryHooks<T> {
  register: (item: T) => void
  unregister: (slug: string) => void
  get: (slug: string) => T | undefined
  getAll: () => T[]
  has: (slug: string) => boolean
}
```

### 4. Configuration

#### RecmsConfig

Main configuration object for ReCMS.

```typescript
interface RecmsConfig {
  api?: {
    pageConfig?: string
    resources?: string
  }
  blocks?: BlockDefinition[]
  columns?: ColumnDefinition[]
  filters?: FilterDefinition[]
  fields?: FieldTypeDefinition[]
  features?: {
    enableEditMode?: boolean
    enableDragDrop?: boolean
    enableAutoSave?: boolean
  }
}
```

#### Using Configuration

```typescript
import { useRecmsConfig } from '@blume/recms-core'

function MyComponent() {
  const config = useRecmsConfig()

  if (config.features?.enableEditMode) {
    // Show edit mode UI
  }
}
```

### 5. Types

Core TypeScript types for the entire system.

```typescript
import type {
  BlockDefinition,
  ColumnDefinition,
  FieldDefinition,
  FilterDefinition,
  BlockConfig,
  PageConfig
} from '@blume/recms-core'
```

### 6. Hooks

#### useRecmsConfig

Access global ReCMS configuration.

```typescript
const config = useRecmsConfig()
```

#### usePageConfig

Fetch and manage page configuration.

```typescript
import { usePageConfig } from '@blume/recms-core'

const { config, isLoading, error } = usePageConfig(resourceId, pageType)
```

### 7. Auth System (Phase 2)

Placeholder types and hooks for future authentication system.

```typescript
import { useAuth, useCurrentUser, usePermissions } from '@blume/recms-core'

// Will be implemented in Phase 2
const { user, login, logout } = useAuth()
const currentUser = useCurrentUser()
const { can, cannot } = usePermissions()
```

## API Reference

### Providers

- `RecmsProvider` - Main provider component
- Props: `config?: Partial<RecmsConfig>`, `children: ReactNode`

### Registry Hooks

- `useBlockRegistry()` - Access block registry
- `useColumnRegistry()` - Access column registry
- `useFieldRegistry()` - Access field registry
- `useFilterRegistry()` - Access filter registry

### Registration Hooks

- `useRegisterBlock(definition)` - Register a block
- `useRegisterColumn(definition)` - Register a column
- `useRegisterField(definition)` - Register a field
- `useRegisterFilter(definition)` - Register a filter

### Configuration Hooks

- `useRecmsConfig()` - Access global configuration
- `usePageConfig(resourceId, pageType)` - Fetch page configuration

### Utility Functions

- `formatHeader(text)` - Format header text
- `getPageNumbers(current, total)` - Calculate pagination
- `buildListFilters(filters)` - Build filter query

## Examples

### Registering a Custom Block

```typescript
import { useRegisterBlock } from '@blume/recms-core'

const analyticsBlockConfig = {
  fields: [
    { name: 'metric', type: 'select', options: ['revenue', 'users'] }
  ]
}

function AnalyticsBlock({ config }) {
  return <div>Analytics: {config.metric}</div>
}

function App() {
  useRegisterBlock({
    slug: 'analytics',
    Component: AnalyticsBlock,
    config: analyticsBlockConfig,
    label: 'Analytics Widget'
  })

  return <div>App</div>
}
```

### Creating a Custom Registry

```typescript
import { createRegistry } from '@blume/recms-core'

const myRegistry = createRegistry<MyItemType>()

myRegistry.register({ slug: 'item-1', ... })
const item = myRegistry.get('item-1')
const all = myRegistry.getAll()
```

## Best Practices

1. **Always use providers** - Wrap your app with `RecmsProvider`
2. **Register components early** - Use `useRegister*` hooks at the root level
3. **Type safety** - Use TypeScript types for all configurations
4. **Lazy loading** - Dynamic import heavy components
5. **Error handling** - Always handle registry lookup failures

## Troubleshooting

### Registry item not found

Make sure the item is registered before trying to access it.

```typescript
const { registerBlock, has } = useBlockRegistry()

if (!has('my-block')) {
  registerBlock(myBlockDefinition)
}
```

### Context not available

Ensure your component is wrapped in `RecmsProvider`.

```typescript
<RecmsProvider config={config}>
  <MyComponent /> {/* Can use hooks here */}
</RecmsProvider>
```

## License

MIT
