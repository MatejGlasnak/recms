# ReCMS Component Refactoring Guide

This document explains the new block-based architecture for the ReCMS plugin.

## Overview

The ReCMS components have been refactored from a flat structure to a **block-based architecture** inspired by PayloadCMS and OctoberCMS. This new structure makes components:

- **Universal**: Each component follows the same pattern (Component.tsx, config.ts, index.ts)
- **Configurable**: All blocks can be configured through a universal settings modal
- **Composable**: Pages are built by composing multiple blocks
- **Type-safe**: Full TypeScript support with proper type definitions

## Architecture

### Block System

A **block** is a self-contained UI component that:
1. Has its own Component.tsx for rendering
2. Has its own config.ts defining configurable fields
3. Exports both through index.ts
4. Can be configured through a universal FormModal

### Registry System

The registry system provides a way to:
- Register block types dynamically
- Register field types for forms
- Retrieve blocks/fields by slug/type at runtime

```typescript
import { BlockRegistryProvider, useBlockRegistry } from '@blume/recms'

// Register a block
const { registerBlock } = useBlockRegistry()
registerBlock({
  slug: 'list-header',
  Component: ListHeader,
  config: listHeaderConfig,
  label: 'List Header'
})

// Use a block
const blockDef = getBlock('list-header')
const BlockComponent = blockDef.Component
```

## Directory Structure

```
src/plugins/@blume/recms/
├── components/
│   ├── registry/              # Block & field registration
│   │   ├── BlockRegistry.tsx
│   │   ├── FieldRegistry.tsx
│   │   └── index.ts
│   ├── form/                  # Universal form system
│   │   ├── FormModal.tsx      # Universal settings modal
│   │   ├── FormField.tsx      # Field renderer
│   │   └── field-types/       # Form input components
│   │       ├── text-field/
│   │       ├── textarea-field/
│   │       ├── dropdown-field/
│   │       ├── checkbox-field/
│   │       └── number-field/
│   ├── filters/               # Filter input components
│   │   ├── filter-input/
│   │   │   ├── Component.tsx
│   │   │   ├── config.ts
│   │   │   └── index.ts
│   │   ├── filter-select/
│   │   ├── filter-combobox/
│   │   └── filter-checkbox/
│   ├── columns/               # Column display components
│   │   ├── column-text/
│   │   ├── column-number/
│   │   ├── column-date/
│   │   ├── column-boolean/
│   │   ├── column-badge/
│   │   └── column-json/
│   ├── blocks/                # Page building blocks
│   │   ├── list-header/
│   │   ├── list-filters/
│   │   ├── list-table/
│   │   └── list-pagination/
│   └── pages/
│       └── list-page/         # Block-based list page
├── types/
│   ├── block-config.ts        # New block-based types
│   └── ...
├── hooks/
│   ├── use-page-config.ts     # Hook for page config API
│   └── ...
└── index.ts                   # Public API exports
```

## Configuration Schema

### Page Config

A page consists of multiple blocks:

```typescript
interface PageConfig {
  id: string | null
  resourceId: string
  blocks: BlockConfig[]
}
```

### Block Config

Each block has:

```typescript
interface BlockConfig {
  id: string                    // Unique instance ID
  slug: string                  // Block type (e.g., 'list-header')
  labels?: Record<string, string>  // i18n labels
  config: Record<string, unknown>  // Block-specific configuration
  visible?: boolean             // Show/hide block
  order?: number                // Display order
}
```

### Example Page Config

```json
{
  "id": "uuid",
  "resourceId": "blog-posts",
  "blocks": [
    {
      "id": "header-1",
      "slug": "list-header",
      "config": {
        "title": "Blog Posts",
        "description": "Manage your blog posts",
        "showEditButton": true
      }
    },
    {
      "id": "filters-1",
      "slug": "list-filters",
      "config": {
        "filters": [
          {
            "id": "status",
            "type": "select",
            "label": "Status",
            "field": "status",
            "operator": "eq",
            "options": [
              { "label": "Published", "value": "published" },
              { "label": "Draft", "value": "draft" }
            ]
          }
        ]
      }
    },
    {
      "id": "table-1",
      "slug": "list-table",
      "config": {
        "columns": [
          {
            "id": "title",
            "field": "title",
            "label": "Title",
            "type": "text",
            "sortable": true,
            "enabledByDefault": true
          }
        ],
        "rowClickAction": "show"
      }
    },
    {
      "id": "pagination-1",
      "slug": "list-pagination",
      "config": {
        "pageSize": 10,
        "pageSizeOptions": [10, 25, 50, 100]
      }
    }
  ]
}
```

## OctoberCMS-Inspired Features

### Field Properties

Fields support OctoberCMS properties:

```typescript
{
  name: 'title',
  type: 'text',
  label: 'Title',
  placeholder: 'Enter title',
  comment: 'Help text below the field',
  commentAbove: 'Help text above the field',
  required: true,
  span: 'full',  // 'auto' | 'left' | 'right' | 'row' | 'full'
  default: 'Default value',
  disabled: false,
  readOnly: false,
  hidden: false
}
```

### Trigger Events

Conditional field visibility:

```typescript
{
  name: 'send_at',
  type: 'text',
  label: 'Send Date',
  trigger: {
    action: 'show',           // 'show' | 'hide' | 'enable' | 'disable'
    field: 'is_delayed',      // Field to watch
    condition: 'checked'      // 'checked' | 'unchecked' | 'value[somevalue]'
  }
}
```

Supported actions:
- `show` - Show field when condition is met
- `hide` - Hide field when condition is met
- `enable` - Enable field when condition is met
- `disable` - Disable field when condition is met

Supported conditions:
- `checked` - Checkbox is checked
- `unchecked` - Checkbox is unchecked
- `value[x]` - Field value equals x
- `value[x][y]` - Field value is x or y (multiple values)
- Wildcard: `value[*.mp4]` - Field value ends with .mp4

### Tabs

Organize fields in tabs:

```typescript
{
  fields: [
    {
      name: 'title',
      type: 'text',
      tab: 'General'
    },
    {
      name: 'advanced_setting',
      type: 'text',
      tab: 'Advanced'
    }
  ],
  tabs: [
    { name: 'General', label: 'General' },
    { name: 'Advanced', label: 'Advanced', lazy: true }
  ]
}
```

## Creating a New Block

To create a new block:

1. **Create the directory structure:**
   ```
   components/blocks/my-block/
   ├── Component.tsx
   ├── config.ts
   └── index.ts
   ```

2. **Define the config (config.ts):**
   ```typescript
   import type { BlockFieldConfig } from '../../registry'

   export const myBlockConfig: BlockFieldConfig = {
     fields: [
       {
         name: 'title',
         type: 'text',
         label: 'Title',
         required: true,
         span: 'full'
       }
     ]
   }
   ```

3. **Create the component (Component.tsx):**
   ```typescript
   'use client'

   import type { BlockComponentProps } from '../../registry'
   import { useState } from 'react'
   import { FormModal } from '../../form/FormModal'
   import { myBlockConfig } from './config'

   export function MyBlock({ blockConfig, editMode }: BlockComponentProps) {
     const [showSettings, setShowSettings] = useState(false)
     const config = blockConfig.config as { title?: string }

     const handleSaveSettings = async (values: Record<string, unknown>) => {
       // TODO: Update block config via API
       console.log('Save settings:', values)
     }

     return (
       <>
         <div className='relative'>
           <h2>{config.title}</h2>

           {editMode && (
             <div
               className='absolute inset-0 bg-primary/5 border-2 border-dashed border-primary rounded-lg cursor-pointer flex items-center justify-center z-10'
               onClick={() => setShowSettings(true)}
             >
               <div className='bg-background px-4 py-2 rounded-md shadow-sm'>
                 <p className='text-sm font-medium'>Click to edit</p>
               </div>
             </div>
           )}
         </div>

         <FormModal
           open={showSettings}
           onOpenChange={setShowSettings}
           title='Block Settings'
           description='Configure this block'
           fieldConfig={myBlockConfig}
           initialValues={config}
           onSubmit={handleSaveSettings}
         />
       </>
     )
   }
   ```

4. **Export (index.ts):**
   ```typescript
   export { MyBlock } from './Component'
   export { myBlockConfig } from './config'
   ```

5. **Register the block:**
   ```typescript
   import { MyBlock, myBlockConfig } from './components/blocks/my-block'

   const { registerBlock } = useBlockRegistry()
   registerBlock({
     slug: 'my-block',
     Component: MyBlock,
     config: myBlockConfig,
     label: 'My Block'
   })
   ```

## Migration from Legacy

The old flat structure is still available for backward compatibility:

```typescript
// Old (still works)
import { ListPage as LegacyListPage } from '@blume/recms'

// New (recommended)
import { ListPage } from '@blume/recms'
```

Legacy components are exported with a `Legacy` prefix:
- `LegacyListPage`
- `LegacyFilterInput`
- `LegacyColumnText`
- etc.

## API Changes

### New API Endpoint

The new block-based config uses:
- `GET /api/admin/config/pages/{resourceId}` - Fetch page config
- `PATCH /api/admin/config/pages/{resourceId}` - Update page config
- `DELETE /api/admin/config/pages/{resourceId}` - Delete page config

The old endpoint `/api/admin/config/lists/{resourceId}` still works and returns legacy format.

### New Hook

```typescript
import { usePageConfig, useUpdatePageConfig } from '@blume/recms'

// Fetch page config
const { data, isLoading } = usePageConfig(resourceId)

// Update page config
const { mutate } = useUpdatePageConfig(resourceId)
mutate({ blocks: [...] })
```

## Benefits

1. **Flexibility**: Add, remove, reorder blocks easily
2. **Reusability**: Blocks can be used across different pages
3. **Consistency**: All blocks follow the same pattern
4. **Type Safety**: Full TypeScript support
5. **Extensibility**: Easy to add new block types
6. **Configuration**: Universal FormModal for all blocks
7. **OctoberCMS Patterns**: Familiar field properties and triggers

## Next Steps

- Implement repeater field type for dynamic lists (filters, columns)
- Add more field types (date picker, color picker, file upload, etc.)
- Create blocks for show/edit pages
- Add block library/marketplace
- Implement block templates/presets
- Add drag-and-drop block reordering in edit mode
