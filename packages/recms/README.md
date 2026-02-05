# @blume/recms

Modern, extensible CMS built on Refine.

## Installation

```bash
npx @blume/create-recms-app my-admin
# or
npm install @blume/recms
```

## Features

- ✅ UI Builder for admin interface
- ✅ Authentication & user management
- ✅ Role-based access control
- ✅ TypeScript support
- ✅ Extensible plugin system
- ✅ Configuration-driven UI
- ✅ Built on Refine & Next.js

## Quick Start

```typescript
import { RecmsApp } from '@blume/recms'

export function Providers({ children }) {
  return (
    <RecmsApp config={recmsConfig}>
      {children}
    </RecmsApp>
  )
}
```

## Documentation

- [Getting Started](https://recms.dev/getting-started)
- [Core Concepts](https://recms.dev/core-concepts)
- [API Reference](https://recms.dev/api)
- [Examples](https://recms.dev/examples)

## Community

- [Discord](https://discord.gg/recms)
- [Twitter](https://twitter.com/recms)
- [GitHub Discussions](https://github.com/blume/recms/discussions)

## License

Dual licensed: MIT & Commercial
