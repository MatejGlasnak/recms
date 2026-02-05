# @blume/recms-core

Core infrastructure for ReCMS - registries, providers, auth, and types.

## Installation

```bash
npm install @blume/recms-core
# or
pnpm add @blume/recms-core
# or
yarn add @blume/recms-core
```

## Features

- **Providers**: Core context providers for configuration, auth, and resources
- **Registries**: Component registries for blocks, columns, fields, and filters
- **Auth System**: Built-in authentication and user management
- **Permission System**: Role-based access control (RBAC)
- **TypeScript**: Full type safety with comprehensive type definitions
- **Hooks**: React hooks for accessing core functionality

## Usage

```typescript
import { RecmsProvider, useAuth, useBlockRegistry } from '@blume/recms-core'

function App() {
  return (
    <RecmsProvider config={recmsConfig}>
      {/* Your app */}
    </RecmsProvider>
  )
}
```

## Documentation

Full documentation available at [https://recms.dev](https://recms.dev)

## License

MIT
