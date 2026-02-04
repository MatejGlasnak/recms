# UI Components

Reusable UI components for consistent loading and error states across pages.

## Components

### PageLoading

A full-page loading indicator with a centered spinner and optional message.

**Usage:**

```tsx
import { PageLoading } from '../../ui/PageLoading'

// Basic usage
<PageLoading />

// With custom message
<PageLoading message="Loading resources…" />

// With custom className
<PageLoading
  message="Loading data…"
  className="min-h-screen"
/>
```

**Props:**

- `message?: string` - The message to display below the spinner (default: "Loading…")
- `className?: string` - Custom className for the container

---

### PageError

A full-page error display with an alert component.

**Usage:**

```tsx
import { PageError } from '../../ui/PageError'

// Simple error message
<PageError message="Failed to load page configuration" />

// With error object
<PageError error={error} message="Failed to load data" />

// With title
<PageError
  title="Configuration Error"
  message="Failed to load page configuration"
/>

// With custom styling
<PageError
  message="Failed to load data"
  alertClassName="mt-4"
/>
```

**Props:**

- `message?: string` - The error message to display
- `title?: string` - Optional error title
- `error?: Error | unknown` - Optional Error object to extract message from
- `className?: string` - Custom className for the container
- `alertClassName?: string` - Custom className for the Alert component

---

### InlineError

A compact error display for showing errors within page content (not taking full page width/height).

**Usage:**

```tsx
import { InlineError } from '../../ui/InlineError'

// Simple error message
{isError && <InlineError message="Failed to load data" />}

// With error object
{isError && <InlineError error={query.error} />}

// With custom styling
{isError && (
  <InlineError
    error={query.error}
    message="Failed to load data"
    className="mb-6"
  />
)}
```

**Props:**

- `message?: string` - The error message to display
- `error?: Error | unknown` - Optional Error object to extract message from
- `className?: string` - Custom className for the Alert component

---

## Example: Refactored List Page

```tsx
function ListPageContent({ resourceId }: { resourceId: string }) {
  const { data, isLoading, isError, error } = useList({ resource: resourceId })
  const { pageConfig, isConfigLoading, isConfigError } = usePageConfig(resourceId)

  // Loading state
  if (isLoading || isConfigLoading) {
    const message = isConfigLoading
      ? 'Loading page configuration…'
      : 'Loading data…'
    return <PageLoading message={message} />
  }

  // Error state
  if (isConfigError || !pageConfig) {
    return <PageError message="Failed to load page configuration" />
  }

  // Page content with inline error
  return (
    <div className="container">
      {isError && (
        <InlineError
          error={error}
          message="Failed to load data"
          className="mb-6"
        />
      )}

      {/* Page content */}
    </div>
  )
}
```

## Benefits

1. **Consistency** - All pages use the same loading and error UI patterns
2. **Reusability** - DRY principle - define once, use everywhere
3. **Maintainability** - Easy to update styles/behavior in one place
4. **Flexibility** - Customizable via props for specific use cases
5. **Type Safety** - Full TypeScript support with well-defined props
