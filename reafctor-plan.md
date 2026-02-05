---
name: ReCMS Plugin Refactoring
overview: Refactoring ReCMS into a modular, extensible plugin system with NPM packages inspired by Payload CMS and Refine architecture. The system will provide a UI-configurable admin interface built on top of Refine with unified block system.
todos:
  - id: setup-monorepo
    content: Create monorepo structure with packages/recms-core, packages/recms-ui, packages/recms
    status: pending
  - id: migrate-core
    content: "Migrate core infrastructure to @blume/recms-core: providers, registries, auth, types"
    status: pending
  - id: migrate-ui
    content: "Migrate UI components to @blume/recms-ui: pages, blocks, columns, fields, filters"
    status: pending
  - id: create-main-package
    content: Create @blume/recms main package with re-exports and RecmsApp convenience wrapper
    status: pending
  - id: refactor-pages
    content: Refactor pages to separate data fetching (move to blocks) from rendering (keep in pages)
    status: pending
  - id: unify-registry-api
    content: Create unified registry API with shared types while keeping separate registries
    status: pending
  - id: implement-auth
    content: Build auth system with user management, RBAC, and permissions (Payload-inspired)
    status: pending
  - id: update-app
    content: Update main app to use new package structure and test all functionality
    status: pending
  - id: documentation
    content: Create documentation for installation, configuration, custom blocks, and API reference
    status: pending
  - id: setup-cli
    content: Create @blume/create-recms-app CLI tool with project scaffolding and generators
    status: pending
  - id: setup-docs
    content: Setup Nextra documentation site with getting started, guides, and API reference
    status: pending
  - id: setup-storybook
    content: Setup Storybook for component documentation and visual testing
    status: pending
  - id: create-templates
    content: Create example template (blog/admin panel) with best practices
    status: pending
  - id: bundle-optimization
    content: Implement tree-shaking, code splitting, and bundle size optimization
    status: pending
  - id: licensing
    content: Setup dual licensing (MIT for open-source + commercial for enterprise)
    status: pending
  - id: publishing-setup
    content: Setup NPM publishing workflow, versioning, and changelog automation
    status: pending
  - id: community-setup
    content: Create CONTRIBUTING.md, CODE_OF_CONDUCT.md, issue templates, and security policy
    status: pending
isProject: false
---

# ReCMS Plugin Refactoring Plan

## Overview

Transform ReCMS from a monolithic structure into a modular plugin ecosystem with three core packages:

- **@blume/recms-core**: Core infrastructure (registries, providers, auth, user management)
- **@blume/recms-ui**: UI blocks and components (tables, forms, layouts)
- **@blume/recms**: Main package (re-exports + glue code)

Inspiration from:

- **Payload CMS**: Configuration-driven UI, extensible block system, auth management
- **Refine**: Provider architecture, resource-based routing, headless approach

## Architecture Goals

### 1. Unified Block System

All components (blocks, columns, filters, fields) share a common interface:

- **Separate registries** for each type (maintains organization)
- **Unified registration API** (consistent developer experience)
- **Shared type system** (BlockDefinition base type)
- **Common configuration pattern** (config schemas + UI editors)

### 2. Provider-First Architecture

```
App
  └─ RecmsProvider (from @blume/recms-core)
      ├─ AuthProvider
      ├─ ResourceProvider
      └─ BlockRegistryProvider
          ├─ ComponentRegistry (blocks/columns/filters/fields)
          └─ ConfigProvider
```

### 3. UI Builder Philosophy

Users should be able to configure **everything** through the UI:

- Resources (collections)
- Pages (list/create/edit/show)
- Blocks on each page
- Fields in forms
- Columns in tables
- Filters and their layout

Only create custom components when built-in blocks can't achieve the desired behavior.

## Package Structure

### Package 1: @blume/recms-core

**Purpose**: Core infrastructure without UI dependencies

**Exports**:

```typescript
// Providers
export { RecmsProvider, AuthProvider, ResourceProvider }

// Registries
export { BlockRegistry, ColumnRegistry, FieldRegistry, FilterRegistry }
export { useBlockRegistry, useColumnRegistry, useFieldRegistry, useFilterRegistry }

// Configuration
export { RecmsConfig, BlockConfig, PageConfig, ResourceConfig }
export { useRecmsConfig, usePageConfig, useResourceConfig }

// Auth & User Management
export { useAuth, useCurrentUser, usePermissions }
export { AuthService, PermissionService }

// Types
export type { User, Role, Permission, Resource, BlockDefinition }

// Hooks
export { useRegistry, useRegisterComponent, useComponentConfig }

// Utilities
export { createBlockConfig, validateConfig, mergeConfigs }
```

**Key Files**:

- `packages/recms-core/src/providers/` - Core providers
- `packages/recms-core/src/registries/` - Component registries with unified API
- `packages/recms-core/src/auth/` - Authentication system
- `packages/recms-core/src/users/` - User management
- `packages/recms-core/src/permissions/` - Permission system
- `packages/recms-core/src/types/` - Shared TypeScript types
- `packages/recms-core/src/hooks/` - Core hooks
- `packages/recms-core/src/config/` - Configuration management

**Auth System** (similar to Payload CMS):

- Built-in user management
- Role-based access control (RBAC)
- Permission system per resource
- Session management
- API key support

### Package 2: @blume/recms-ui

**Purpose**: UI blocks, components, and renderers

**Exports**:

```typescript
// Pages (composable, data-agnostic)
export { ListPage, CreatePage, EditPage, ShowPage }
export { PageWrapper, PageRenderer }

// Page Blocks
export { ListHeader, ListFilters, ListTable, ListPagination }
export { ShowHeader, ShowContent }
export { EditHeader, EditForm }
export { CreateHeader, CreateForm }

// Layout Blocks
export { Grid, Tabs, Accordion, Card }

// Columns (for tables)
export { TextColumn, NumberColumn, DateColumn, BooleanColumn, BadgeColumn, JsonColumn }

// Filters (for list pages)
export { InputFilter, SelectFilter, ComboboxFilter, CheckboxFilter, DateRangeFilter }

// Fields (for forms)
export { TextField, TextareaField, NumberField, DropdownField, CheckboxField, SwitchField }
export { DateField, TimeField, RepeaterField, RelationField }

// Renderers
export { BlockRenderer, ColumnRenderer, FilterRenderer, FieldRenderer }

// UI Components
export { FormModal, EditableWrapper, ConfigEditor }
export { PageLoading, PageError, EmptyState }

// Block Configs (for registration)
export { listHeaderConfig, listTableConfig, showContentConfig, ... }
```

**Key Files**:

- `packages/recms-ui/src/pages/` - Page components (no data fetching)
- `packages/recms-ui/src/blocks/` - Page-level blocks
- `packages/recms-ui/src/columns/` - Table column components
- `packages/recms-ui/src/filters/` - Filter components
- `packages/recms-ui/src/fields/` - Form field components
- `packages/recms-ui/src/renderers/` - Generic renderers
- `packages/recms-ui/src/layouts/` - Layout blocks (Grid, Tabs, etc.)
- `packages/recms-ui/src/components/` - Shared UI components

**Page Architecture** (key improvement):

```typescript
// Example: ListPage.tsx (in @blume/recms-ui)
export function ListPage({ resource }: { resource: string }) {
  // This component does NO data fetching
  // It only renders the configured blocks

  return (
    <PageWrapper
      resource={resource}
      pageType="list"
    />
  )
}

// PageWrapper fetches config and renders blocks
// Each block can fetch its own data via hooks
```

**Block Renderer Pattern**:

```typescript
// BlockRenderer (smart component)
export function BlockRenderer({ blockConfig, context }) {
  const { getBlock } = useBlockRegistry()
  const Block = getBlock(blockConfig.slug)

  return (
    <EditableWrapper config={blockConfig}>
      <Block
        config={blockConfig.config}
        context={context}
      />
    </EditableWrapper>
  )
}

// ListTable block example
export function ListTable({ config, context }) {
  // Block handles its own data fetching
  const { data, isLoading } = useList({
    resource: context.resource,
    ...config
  })

  return <Table data={data} columns={config.columns} />
}
```

### Package 3: @blume/recms

**Purpose**: Main entry point, convenience exports, default setup

**Exports**:

```typescript
// Re-exports from core
export * from '@blume/recms-core'

// Re-exports from ui
export * from '@blume/recms-ui'

// Convenience: Pre-configured provider
export { RecmsApp } from './RecmsApp'

// Convenience: Default configs
export { defaultRecmsConfig } from './defaults'

// CLI (future)
export { createRecmsApp } from './cli'
```

**RecmsApp Component** (convenience wrapper):

```typescript
export function RecmsApp({
  config,
  children
}: RecmsAppProps) {
  return (
    <RecmsProvider config={config}>
      <AuthProvider>
        <ResourceProvider>
          <BlockRegistryProvider>
            {children}
          </BlockRegistryProvider>
        </ResourceProvider>
      </AuthProvider>
    </RecmsProvider>
  )
}
```

## File Structure

```
packages/
├── recms-core/
│   ├── src/
│   │   ├── index.ts                      # Main exports
│   │   ├── providers/
│   │   │   ├── RecmsProvider.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ResourceProvider.tsx
│   │   │   └── index.ts
│   │   ├── registries/
│   │   │   ├── BaseRegistry.ts           # Shared registry logic
│   │   │   ├── BlockRegistry.tsx
│   │   │   ├── ColumnRegistry.tsx
│   │   │   ├── FieldRegistry.tsx
│   │   │   ├── FilterRegistry.tsx
│   │   │   └── types.ts                  # Unified registry types
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCurrentUser.ts
│   │   │   │   └── usePermissions.ts
│   │   │   ├── services/
│   │   │   │   ├── AuthService.ts
│   │   │   │   └── PermissionService.ts
│   │   │   └── types.ts
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   ├── permissions/
│   │   │   ├── PermissionChecker.ts
│   │   │   ├── usePermission.ts
│   │   │   └── types.ts
│   │   ├── config/
│   │   │   ├── RecmsConfig.ts
│   │   │   ├── context.tsx
│   │   │   ├── hooks.ts
│   │   │   └── types.ts
│   │   ├── types/
│   │   │   ├── index.ts
│   │   │   ├── block.ts
│   │   │   ├── resource.ts
│   │   │   ├── user.ts
│   │   │   └── config.ts
│   │   ├── hooks/
│   │   │   ├── usePageConfig.ts
│   │   │   ├── useResourceConfig.ts
│   │   │   ├── useUpdateConfig.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── validation.ts
│   │       ├── config-merger.ts
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── recms-ui/
│   ├── src/
│   │   ├── index.ts                      # Main exports
│   │   ├── pages/
│   │   │   ├── ListPage.tsx              # No data fetching
│   │   │   ├── CreatePage.tsx
│   │   │   ├── EditPage.tsx
│   │   │   ├── ShowPage.tsx
│   │   │   ├── PageWrapper.tsx           # Config fetching + rendering
│   │   │   └── index.ts
│   │   ├── blocks/
│   │   │   ├── list/
│   │   │   │   ├── ListHeader/
│   │   │   │   │   ├── ListHeader.tsx
│   │   │   │   │   ├── config.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ListFilters/
│   │   │   │   ├── ListTable/
│   │   │   │   └── ListPagination/
│   │   │   ├── show/
│   │   │   │   ├── ShowHeader/
│   │   │   │   └── ShowContent/
│   │   │   ├── edit/
│   │   │   ├── create/
│   │   │   └── index.ts
│   │   ├── columns/
│   │   │   ├── TextColumn/
│   │   │   ├── NumberColumn/
│   │   │   ├── DateColumn/
│   │   │   └── index.ts
│   │   ├── filters/
│   │   │   ├── InputFilter/
│   │   │   ├── SelectFilter/
│   │   │   └── index.ts
│   │   ├── fields/
│   │   │   ├── TextField/
│   │   │   ├── NumberField/
│   │   │   └── index.ts
│   │   ├── layouts/
│   │   │   ├── Grid/
│   │   │   ├── Tabs/
│   │   │   └── index.ts
│   │   ├── renderers/
│   │   │   ├── BlockRenderer.tsx
│   │   │   ├── ColumnRenderer.tsx
│   │   │   ├── FieldRenderer.tsx
│   │   │   └── FilterRenderer.tsx
│   │   ├── components/
│   │   │   ├── FormModal.tsx
│   │   │   ├── EditableWrapper.tsx
│   │   │   ├── ConfigEditor.tsx
│   │   │   ├── PageLoading.tsx
│   │   │   └── PageError.tsx
│   │   └── hooks/
│   │       ├── useBlockData.ts
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── recms/
│    ├── src/
│    │   ├── index.ts                      # Re-exports
│    │   ├── RecmsApp.tsx                  # Convenience component
│    │   ├── defaults.ts                   # Default configurations
│    │   └── types.ts
│    ├── package.json
│    └── tsconfig.json
│
└── create-recms-app/                    # CLI Tool Package
    ├── src/
    │   ├── index.ts                      # CLI entry point
    │   ├── commands/
    │   │   ├── create.ts                 # create-recms-app command
    │   │   ├── generate.ts               # Generate resource/block/field
    │   │   └── upgrade.ts                # Upgrade to latest version
    │   ├── templates/
    │   │   ├── basic/                    # Basic starter template
    │   │   └── typescript/               # TypeScript template
    │   ├── utils/
    │   │   ├── package-manager.ts        # Detect and use npm/pnpm/yarn
    │   │   ├── git.ts                    # Git initialization
    │   │   └── prompts.ts                # CLI prompts
    │   └── generators/
    │       ├── resource.ts               # Generate resource files
    │       ├── block.ts                  # Generate custom block
    │       └── field.ts                  # Generate custom field
    ├── templates/                        # Template files
    │   └── basic/                        # Basic Next.js + ReCMS template
    │       ├── app/
    │       ├── components/
    │       ├── recms.config.ts
    │       ├── package.json
    │       └── README.md
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## Migration from Current Structure

### Current Structure

```
src/plugins/@blume/recms/
├── core/
├── pages/
├── blocks/
├── columns/
├── filters/
├── fields/
└── ui/
```

### Migration Mapping

**From** `[src/plugins/@blume/recms/core](src/plugins/@blume/recms/core)`
**To** → `packages/recms-core/src`

**From** `[src/plugins/@blume/recms/pages](src/plugins/@blume/recms/pages)`
**To** → `packages/recms-ui/src/pages`

**From** `[src/plugins/@blume/recms/blocks](src/plugins/@blume/recms/blocks)`
**To** → `packages/recms-ui/src/blocks`

**From** `[src/plugins/@blume/recms/columns](src/plugins/@blume/recms/columns)`
**To** → `packages/recms-ui/src/columns`

**From** `[src/plugins/@blume/recms/filters](src/plugins/@blume/recms/filters)`
**To** → `packages/recms-ui/src/filters`

**From** `[src/plugins/@blume/recms/fields](src/plugins/@blume/recms/fields)`
**To** → `packages/recms-ui/src/fields`

**From** `[src/plugins/@blume/recms/ui](src/plugins/@blume/recms/ui)`
**To** → `packages/recms-ui/src/components` + `packages/recms-ui/src/renderers`

## Key Improvements

### 1. Separation of Data and UI

**Current** (mixed concerns):

```typescript
// ListPage.tsx
export function ListPage() {
  const { data, filters, setFilters } = useList()  // Data fetching

  return (
    <PageWrapper>
      <BlockRenderer blocks={blocks} data={data} />  // UI rendering
    </PageWrapper>
  )
}
```

**Refactored** (separated):

```typescript
// ListPage.tsx (no data fetching)
export function ListPage({ resource }) {
  return <PageWrapper resource={resource} pageType="list" />
}

// ListTable block (handles own data)
export function ListTable({ config, context }) {
  const { data } = useList({ resource: context.resource })
  return <Table data={data} />
}
```

### 2. Composable Layout System

Users can create custom layouts by combining blocks:

```typescript
// Via UI builder, generates config:
{
  pageType: 'list',
  resource: 'products',
  blocks: [
    { slug: 'list-header', order: 0 },
    {
      slug: 'grid',
      order: 1,
      config: {
        columns: 2,
        blocks: [
          { slug: 'filter-input', config: { field: 'name' } },
          { slug: 'filter-select', config: { field: 'category' } }
        ]
      }
    },
    { slug: 'list-table', order: 2 },
    { slug: 'list-pagination', order: 3 }
  ]
}
```

### 3. Unified Registry API

All component types use the same registration pattern:

```typescript
// In user's app
import { useRegisterBlock, useRegisterColumn } from '@blume/recms-core'

// Register custom block
useRegisterBlock({
  slug: 'analytics-widget',
  Component: AnalyticsWidget,
  config: analyticsConfig,
  label: 'Analytics',
  description: 'Dashboard analytics'
})

// Register custom column
useRegisterColumn({
  slug: 'status-badge',
  Component: StatusBadge,
  config: statusConfig,
  label: 'Status Badge'
})
```

### 4. Resource-Based Configuration

Following Payload CMS pattern, resources are fully configurable:

```typescript
// Resource config (stored in DB)
{
  name: 'products',
  label: 'Products',
  slug: 'products',

  // Permissions
  access: {
    read: ({ user }) => true,
    create: ({ user }) => user.role === 'admin',
    update: ({ user }) => user.role === 'admin',
    delete: ({ user }) => user.role === 'admin'
  },

  // Fields definition
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'category', type: 'relation', collection: 'categories' }
  ],

  // Hooks
  hooks: {
    beforeCreate: async ({ data }) => { ... },
    afterCreate: async ({ doc }) => { ... }
  }
}
```

### 5. Auth & User Management (Payload CMS-inspired)

Built-in user management system:

```typescript
// User collection (auto-generated)
{
  name: 'users',
  auth: {
    tokenExpiration: 7200,
    verify: true,
    maxLoginAttempts: 5,
    lockTime: 600000
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'roles', type: 'select', options: ['admin', 'editor', 'viewer'] }
  ]
}

// In app
const { user, login, logout } = useAuth()
const hasPermission = usePermission('products', 'create')
```

## Developer Experience

### Installation

```bash
npm install @blume/recms @blume/recms-core @blume/recms-ui
```

### Basic Setup

```typescript
// app/providers.tsx
import { RecmsApp } from '@blume/recms'

export function Providers({ children }) {
  return (
    <RecmsApp config={recmsConfig}>
      <RefineProvider>
        {children}
      </RefineProvider>
    </RecmsApp>
  )
}
```

### Creating Custom Screen

```typescript
// app/admin/products/list/page.tsx
import { ListPage } from '@blume/recms-ui'

export default function ProductsListPage() {
  // Option 1: Use default (UI-configurable)
  return <ListPage resource="products" />

  // Option 2: Custom with default blocks
  return (
    <div>
      <ListHeader resource="products" />
      <CustomFilters />  {/* Your custom component */}
      <ListTable resource="products" />
      <ListPagination resource="products" />
    </div>
  )
}
```

### Extending with Custom Blocks

```typescript
// components/blocks/AnalyticsWidget.tsx
import { useRegisterBlock } from '@blume/recms-core'

export function AnalyticsWidget({ config }) {
  return <div>Analytics: {config.metric}</div>
}

export const analyticsConfig = {
  fields: [
    { name: 'metric', type: 'select', options: ['revenue', 'users', 'orders'] }
  ]
}

// Register in recms.config.ts
export default {
  blocks: [
    {
      slug: 'analytics-widget',
      Component: AnalyticsWidget,
      config: analyticsConfig,
      label: 'Analytics Widget'
    }
  ]
}
```

## Package 4: @blume/create-recms-app

**Purpose**: CLI tool for project scaffolding and code generation

**Features**:

### Project Creation

```bash
# Interactive mode
npx @blume/create-recms-app

# With options
npx @blume/create-recms-app my-admin --template basic --pm pnpm

# Available templates:
# - basic: Simple blog/admin panel
# - typescript: Fully typed template with best practices
```

### Code Generators

```bash
# Generate new resource
recms generate resource products

# Generate custom block
recms generate block analytics-widget

# Generate custom field
recms generate field rich-editor

# Generate custom column
recms generate column status-badge
```

### CLI Features:

- **Smart package manager detection** (npm/yarn/pnpm/bun)
- **Git initialization** with sensible `.gitignore`
- **Environment setup** (`.env.local` with defaults)
- **Interactive prompts** for configuration
- **Template selection** (basic, advanced, e-commerce)
- **Dependency installation** with progress
- **Post-install instructions** with next steps

### CLI Package Structure

```typescript
// bin/create-recms-app.ts
#!/usr/bin/env node
import { create } from './commands/create'
import { generate } from './commands/generate'
import { program } from 'commander'

program
  .name('create-recms-app')
  .description('Create a new ReCMS application')
  .argument('[project-name]', 'Project name')
  .option('-t, --template <template>', 'Template to use', 'basic')
  .option('--pm <manager>', 'Package manager (npm/yarn/pnpm/bun)')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .action(create)

program
  .command('generate <type> <name>')
  .alias('g')
  .description('Generate resource, block, field, or column')
  .option('--path <path>', 'Output path')
  .action(generate)

program.parse()
```

## Public NPM Package Requirements

### 1. Licensing Strategy

**Dual License Model** (inspired by Ghost, Sentry):

**MIT License** (Open Source):

- Full source code access
- Free for all non-commercial and small commercial projects
- Community support
- Self-hosted deployment

**Commercial License** (Enterprise):

- Priority support (email, Slack)
- Private training sessions
- Custom feature development
- Legal indemnification
- White-label options
- SLA guarantees

**License Files**:

```
LICENSE-MIT.md        # MIT license text
LICENSE-COMMERCIAL.md # Commercial license terms
LICENSING.md          # Explanation of dual licensing
```

### 2. Bundle Optimization

**Tree-Shaking Support**:

- Pure ESM exports with proper `sideEffects` configuration
- Granular imports (import specific components)
- Code splitting for large components
- Dynamic imports for heavy dependencies

**package.json** optimization:

```json
{
  "name": "@blume/recms-ui",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./blocks/*": {
      "types": "./dist/blocks/*/index.d.ts",
      "import": "./dist/blocks/*/index.js"
    },
    "./fields/*": "./dist/fields/*/index.js",
    "./columns/*": "./dist/columns/*/index.js"
  },
  "sideEffects": false,
  "files": ["dist", "README.md", "LICENSE-MIT.md"]
}
```

**Build configuration** (tsup):

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'blocks/index': 'src/blocks/index.ts',
    'fields/index': 'src/fields/index.ts',
    'columns/index': 'src/columns/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: ['react', 'react-dom', '@refinedev/core'],
  minify: false, // Users will minify in their build
  tsconfig: './tsconfig.json'
})
```

**Target bundle sizes** (gzipped):

- `@blume/recms-core`: < 50 KB
- `@blume/recms-ui`: < 150 KB (without blocks)
- Individual blocks: < 10 KB each
- Total (all packages): < 250 KB

### 3. Peer Dependencies

**Core dependencies** (users must install):

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0",
    "@refinedev/core": "^5.0.0",
    "next": "^14.0.0 || ^15.0.0 || ^16.0.0"
  },
  "peerDependenciesMeta": {
    "next": {
      "optional": true
    }
  }
}
```

**Internal dependencies**:

- `@blume/recms-ui` depends on `@blume/recms-core`
- `@blume/recms` depends on both

### 4. Documentation Setup (Nextra)

**Documentation site structure**:

```
docs/
├── app/                          # Next.js app with Nextra
│   ├── layout.tsx
│   ├── page.tsx
│   └── [...slug]/page.tsx
├── content/
│   ├── index.mdx                 # Homepage
│   ├── getting-started/
│   │   ├── installation.mdx
│   │   ├── quick-start.mdx
│   │   ├── first-resource.mdx
│   │   └── configuration.mdx
│   ├── core-concepts/
│   │   ├── architecture.mdx
│   │   ├── providers.mdx
│   │   ├── registries.mdx
│   │   ├── blocks.mdx
│   │   └── resources.mdx
│   ├── guides/
│   │   ├── custom-blocks.mdx
│   │   ├── custom-fields.mdx
│   │   ├── authentication.mdx
│   │   ├── permissions.mdx
│   │   ├── theming.mdx
│   │   └── deployment.mdx
│   ├── api/
│   │   ├── recms-core/
│   │   │   ├── providers.mdx
│   │   │   ├── registries.mdx
│   │   │   ├── hooks.mdx
│   │   │   └── types.mdx
│   │   ├── recms-ui/
│   │   │   ├── pages.mdx
│   │   │   ├── blocks.mdx
│   │   │   ├── fields.mdx
│   │   │   └── columns.mdx
│   │   └── cli.mdx
│   ├── examples/
│   │   ├── blog.mdx
│   │   ├── e-commerce.mdx
│   │   └── dashboard.mdx
│   └── community/
│       ├── contributing.mdx
│       ├── code-of-conduct.mdx
│       └── changelog.mdx
├── components/
│   ├── CodeBlock.tsx
│   ├── ApiReference.tsx
│   └── LiveExample.tsx
├── public/
│   ├── examples/
│   └── screenshots/
├── package.json
└── next.config.js
```

**Features**:

- Search powered by Algolia DocSearch
- Dark/light mode
- API reference with TypeScript signatures
- Live code examples with CodeSandbox integration
- Versioned docs (v1, v2, etc.)
- Multi-language support (EN, SK)

### 5. Storybook Setup

**Component documentation structure**:

```
storybook/
├── .storybook/
│   ├── main.ts
│   ├── preview.tsx
│   └── theme.ts
├── stories/
│   ├── introduction.mdx
│   ├── blocks/
│   │   ├── ListHeader.stories.tsx
│   │   ├── ListTable.stories.tsx
│   │   └── ShowContent.stories.tsx
│   ├── fields/
│   │   ├── TextField.stories.tsx
│   │   ├── NumberField.stories.tsx
│   │   └── RepeaterField.stories.tsx
│   ├── columns/
│   │   ├── TextColumn.stories.tsx
│   │   └── DateColumn.stories.tsx
│   └── layouts/
│       ├── Grid.stories.tsx
│       └── Tabs.stories.tsx
└── package.json
```

**Storybook features**:

- Controls for all component props
- Actions logging
- Accessibility testing (a11y addon)
- Visual regression testing (Chromatic)
- Responsive viewport testing
- Theme switching
- Mock data providers

### 6. Example Templates

**Basic Template** (blog/admin):

```
templates/basic/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── [resource]/
│   │       ├── page.tsx              # List
│   │       ├── create/page.tsx
│   │       ├── [id]/page.tsx         # Show
│   │       └── [id]/edit/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth].ts
│   │   └── [...]/route.ts
│   └── layout.tsx
├── components/
├── lib/
│   ├── auth.ts
│   └── db.ts
├── recms.config.ts
├── .env.example
├── package.json
├── README.md
└── SETUP.md                         # Step-by-step setup guide
```

**Template features**:

- Pre-configured authentication
- Sample resources (posts, categories, users)
- Custom blocks examples
- Best practices demonstrated
- Production-ready structure
- Docker setup (optional)
- Deployment guides (Vercel, AWS, self-hosted)

### 7. Publishing & Release Workflow

**Versioning Strategy** (Semantic Versioning):

- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

**Automated Publishing**:

```yaml
# .github/workflows/publish.yml
name: Publish to NPM

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: pnpm install

      - name: Build packages
        run: pnpm build

      - name: Run tests
        run: pnpm test

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Changelog Automation** (Changesets):

```bash
# Add a changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish to NPM
pnpm changeset publish
```

### 8. Community & Contribution

**Repository structure**:

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.yml
│   ├── feature_request.yml
│   └── question.yml
├── PULL_REQUEST_TEMPLATE.md
├── workflows/
│   ├── ci.yml
│   ├── publish.yml
│   ├── docs-deploy.yml
│   └── storybook-deploy.yml
└── FUNDING.yml

CONTRIBUTING.md          # How to contribute
CODE_OF_CONDUCT.md      # Community guidelines
SECURITY.md             # Security policy & disclosure
LICENSE-MIT.md          # Open source license
LICENSE-COMMERCIAL.md   # Commercial license
LICENSING.md            # Explanation
CHANGELOG.md            # Auto-generated
```

**CONTRIBUTING.md** includes:

- Development setup
- Code style guide
- Testing requirements
- PR process
- Commit message format
- Documentation updates

**CODE_OF_CONDUCT.md**:

- Based on Contributor Covenant
- Clear expectations
- Reporting process
- Enforcement

**SECURITY.md**:

- Responsible disclosure process
- Supported versions
- Security contacts
- Bug bounty (future)

### 9. Quality Assurance

**Testing Setup**:

```
tests/
├── unit/
│   ├── registries/
│   ├── providers/
│   └── hooks/
├── integration/
│   ├── auth/
│   └── resources/
└── e2e/
    ├── list-page.spec.ts
    ├── create-page.spec.ts
    └── edit-page.spec.ts
```

**CI/CD Pipeline**:

- Lint (ESLint, Prettier)
- Type check (TypeScript)
- Unit tests (Vitest)
- Integration tests (Testing Library)
- E2E tests (Playwright)
- Build verification
- Bundle size check
- Visual regression (Chromatic)

**Code quality tools**:

- ESLint with strict rules
- Prettier for formatting
- Husky for git hooks
- Commitlint for commit messages
- Bundle size analyzer
- Lighthouse CI for performance

### 10. Developer Resources

**README.md structure**:

```markdown
# ReCMS

> Modern, extensible CMS built on Refine

[Features] [Quick Start] [Documentation] [Examples] [Community]

## Quick Start
...

## Features
- ✅ UI Builder
- ✅ Authentication
- ✅ Role-based Access
- ✅ TypeScript
...

## Packages
- @blume/recms-core
- @blume/recms-ui
- @blume/recms
- @blume/create-recms-app

## Community
- Discord
- Twitter
- GitHub Discussions

## License
Dual licensed: MIT & Commercial
```

**Package READMEs**:

- Each package has its own README
- Installation instructions
- Basic usage examples
- Link to full docs
- API reference overview

**Comparison table** (for documentation):


| Feature       | ReCMS    | Payload CMS | Refine         | Strapi   |
| ------------- | -------- | ----------- | -------------- | -------- |
| UI Builder    | ✅        | ❌           | ❌              | ❌        |
| Auth Built-in | ✅        | ✅           | ❌              | ✅        |
| Headless      | ✅        | ✅           | ✅              | ✅        |
| Framework     | Next.js  | Next.js     | Any            | Node.js  |
| Admin UI      | Included | Included    | Build your own | Included |


## Implementation Notes

### TypeScript Configuration

All packages will share a base `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Build System

Use modern build tools:

- **tsup** for library builds (fast, simple)
- **Turborepo** for monorepo management (optional)
- **Changesets** for version management

### Testing Strategy

- Unit tests for registries and hooks
- Integration tests for providers
- E2E tests for UI blocks
- Visual regression tests for components

### Documentation Structure

```
docs/
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── configuration.md
├── core-concepts/
│   ├── providers.md
│   ├── registries.md
│   ├── blocks.md
│   └── resources.md
├── guides/
│   ├── custom-blocks.md
│   ├── custom-fields.md
│   ├── authentication.md
│   └── permissions.md
└── api/
    ├── recms-core.md
    ├── recms-ui.md
    └── hooks.md
```

## Success Criteria

### Core Functionality

✅ Users can install ReCMS via npm
✅ 90% of UI is configurable through UI builder
✅ Custom blocks can be created with <50 lines of code
✅ Layout is fully composable (provider or full export)
✅ Auth and user management work out of the box
✅ Clear separation between data layer and UI layer
✅ Extensible via plugins without modifying core
✅ TypeScript types are accurate and helpful

### Public Package Requirements

✅ Published on NPM with proper versioning
✅ CLI tool (`create-recms-app`) works out of the box
✅ Comprehensive documentation site (Nextra)
✅ Component documentation (Storybook)
✅ Example templates available
✅ Bundle size optimized (tree-shaking works)
✅ Dual licensing properly implemented
✅ Automated publishing workflow
✅ Community guidelines in place

### Quality Standards

✅ >90% test coverage
✅ <250 KB total bundle size (gzipped)
✅ Lighthouse score >90 for docs
✅ All packages have README
✅ API fully documented with examples
✅ No critical security vulnerabilities
✅ Passes accessibility tests
✅ Works on all modern browsers

### Developer Experience

✅ Project scaffolding in <2 minutes
✅ Hot reload works perfectly
✅ TypeScript autocomplete comprehensive
✅ Error messages are clear and actionable
✅ Debug tools available
✅ Migration guides provided
✅ Community support channels active

## Comparison with Inspiration

### Like Payload CMS

- Configuration-driven resources
- Built-in auth and user management
- Field-based configuration
- Access control per resource
- Hooks system

### Like Refine

- Provider architecture
- Resource-based routing
- Headless approach
- Data provider abstraction
- Framework agnostic core

### Unique to ReCMS

- UI block builder for admin interface
- Unified registry system
- Visual configuration editor
- Grid and tabs layout blocks
- Deep Refine integration

## Implementation Roadmap

### Phase 1: Core Refactoring (Weeks 1-3)

**Goal**: Migrate to monorepo structure with core packages

**Tasks**:

1. Setup monorepo structure (pnpm workspaces)
2. Create `@blume/recms-core` package
  - Migrate providers
  - Migrate registries with unified API
  - Setup base configuration system
3. Create `@blume/recms-ui` package
  - Migrate pages (refactor to separate data/UI)
  - Migrate blocks
  - Migrate columns, fields, filters
4. Create `@blume/recms` main package
  - Setup re-exports
  - Create RecmsApp wrapper
5. Update build system (tsup, tsconfig)
6. Test basic functionality

**Deliverable**: Working monorepo with 3 packages, basic functionality intact

### Phase 2: Auth & User Management (Weeks 4-5)

**Goal**: Implement Payload-inspired auth system

**Tasks**:

1. Design auth architecture
2. Implement AuthProvider
3. Build user management system
4. Create RBAC system
5. Add permission checking
6. Build auth UI components
7. Create user resource
8. Add session management
9. Implement API key support
10. Write tests

**Deliverable**: Full auth system with user management

### Phase 3: Bundle Optimization (Week 6)

**Goal**: Optimize for production npm package

**Tasks**:

1. Setup proper exports in package.json
2. Configure tree-shaking
3. Implement code splitting
4. Setup peer dependencies correctly
5. Optimize bundle sizes
6. Add bundle size CI checks
7. Test tree-shaking works
8. Document import strategies

**Deliverable**: Optimized packages with <250KB total size

### Phase 4: CLI Tool (Week 7)

**Goal**: Create create-recms-app CLI

**Tasks**:

1. Setup CLI package structure
2. Implement create command
3. Add template system
4. Create basic template
5. Implement generators (resource, block, field)
6. Add interactive prompts
7. Setup package manager detection
8. Add git initialization
9. Test CLI thoroughly
10. Write CLI documentation

**Deliverable**: Working CLI tool with basic template

### Phase 5: Documentation (Weeks 8-9)

**Goal**: Create comprehensive documentation

**Tasks**:

1. Setup Nextra site
2. Write getting started guide
3. Document core concepts
4. Create API reference
5. Write guides (custom blocks, auth, etc.)
6. Add code examples
7. Create comparison table
8. Setup search (Algolia)
9. Add versioning support
10. Deploy to production

**Deliverable**: Live documentation site

### Phase 6: Storybook & Examples (Week 10)

**Goal**: Component documentation and templates

**Tasks**:

1. Setup Storybook
2. Write stories for all components
3. Add controls and actions
4. Setup visual regression testing
5. Create basic template
6. Add example custom blocks
7. Document template structure
8. Test template scaffolding
9. Deploy Storybook

**Deliverable**: Storybook site + working template

### Phase 7: Publishing Setup (Week 11)

**Goal**: Prepare for public release

**Tasks**:

1. Setup dual licensing
2. Create LICENSE files
3. Write CONTRIBUTING.md
4. Add CODE_OF_CONDUCT.md
5. Create SECURITY.md
6. Setup issue templates
7. Add PR template
8. Setup Changesets
9. Configure CI/CD for publishing
10. Setup NPM organization (@blume)
11. Test publishing workflow
12. Create release checklist

**Deliverable**: Ready-to-publish packages

### Phase 8: Testing & QA (Week 12)

**Goal**: Comprehensive testing

**Tasks**:

1. Write unit tests (target >90% coverage)
2. Add integration tests
3. Setup E2E tests (Playwright)
4. Add visual regression tests
5. Setup accessibility tests
6. Performance testing
7. Security audit
8. Browser compatibility testing
9. Fix all issues
10. Document testing strategy

**Deliverable**: Well-tested, production-ready packages

### Phase 9: Beta Release (Week 13)

**Goal**: Soft launch to community

**Tasks**:

1. Publish beta versions to NPM
2. Announce on social media
3. Gather feedback
4. Fix critical issues
5. Update documentation based on feedback
6. Create migration guide
7. Test with real projects
8. Prepare launch materials

**Deliverable**: Beta packages on NPM

### Phase 10: Public Launch (Week 14)

**Goal**: Official v1.0.0 release

**Tasks**:

1. Final QA pass
2. Publish v1.0.0 to NPM
3. Announce launch
4. Setup community channels (Discord, Twitter)
5. Create launch blog post
6. Submit to product directories
7. Reach out to tech media
8. Monitor for issues
9. Provide community support
10. Celebrate! 🎉

**Deliverable**: Public v1.0.0 release

## Post-Launch Roadmap

### v1.1.0 - Enhanced Features (Months 2-3)

- Advanced field types (file upload, rich text, relationship)
- Plugin marketplace
- Additional templates (e-commerce, dashboard)
- Performance improvements
- More block types

### v1.2.0 - Enterprise Features (Months 4-6)

- Multi-tenancy support
- Advanced permissions
- Audit logs
- Webhooks
- API versioning
- Custom data providers

### v2.0.0 - Major Evolution (Months 7-12)

- Visual page builder (drag & drop)
- GraphQL API
- Real-time collaboration
- Advanced workflows
- AI-powered features
- Mobile app support

