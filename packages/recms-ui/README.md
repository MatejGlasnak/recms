# @blume/recms-ui

UI components and blocks for ReCMS.

## Installation

```bash
npm install @blume/recms-ui @blume/recms-core
# or
pnpm add @blume/recms-ui @blume/recms-core
# or
yarn add @blume/recms-ui @blume/recms-core
```

## Features

- **Pages**: Pre-built page components (List, Create, Edit, Show)
- **Blocks**: Configurable page-level blocks
- **Columns**: Table column renderers
- **Fields**: Form field components
- **Filters**: Filter components for list pages
- **Layouts**: Layout blocks (Grid, Tabs, etc.)
- **Renderers**: Generic component renderers

## Usage

```typescript
import { ListPage, ListHeader, ListTable } from '@blume/recms-ui'

function ProductsPage() {
  return <ListPage resource="products" />
}
```

## Documentation

Full documentation available at [https://recms.dev](https://recms.dev)

## License

MIT
