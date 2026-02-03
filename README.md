# ReCMS - Admin POC

A Next.js-based admin panel with authentication, MongoDB, and GraphQL integration.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** Shadcn UI Components + Tailwind CSS
- **Database:** MongoDB
- **API:** GraphQL (Apollo Server + Client)
- **Auth:** NextAuth.js with JWT
- **Admin Framework:** Refine
- **Forms:** React Hook Form + Zod

## Features

- ✅ User authentication with NextAuth
- ✅ Protected admin routes with auth guards
- ✅ MongoDB integration for users and admin pages
- ✅ GraphQL API for internal and external data
- ✅ Shared TypeScript types across API and UI
- ✅ Modern UI with Shadcn components
- ✅ Dynamic page rendering system

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally or remote connection
- pnpm (recommended) or npm

### 2. Installation

```bash
# Install dependencies
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/recms

# NextAuth configuration
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Start MongoDB

If running locally:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
mongod
```

### 5. Seed Initial User

Seed the database with the initial test user:

```bash
pnpm seed:all
```

This will create:
- **testing@blume.sk** / `1234567890`

The script is idempotent - you can run it multiple times safely.

Alternatively, create a custom admin user using the API:

```bash
# With dev server running
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000/auth/login](http://localhost:3000/auth/login) to access the login page.

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm seed:all     # Seed database with initial users
```

## Project Structure

```
src/
├── app/
│   ├── admin/                  # Protected admin area
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── [slug]/             # Dynamic admin pages
│   │   └── layout.tsx          # Admin layout with auth guard
│   ├── auth/
│   │   ├── login/              # Login page
│   │   └── layout.tsx          # Auth layout (public)
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth endpoints
│       ├── graphql/            # GraphQL API endpoint
│       └── users/              # User management API
├── components/
│   ├── ui/                     # Shadcn UI components
│   └── providers.tsx           # App providers (SessionProvider)
├── lib/
│   ├── auth/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── guard.tsx           # Client auth guard
│   │   └── server-guard.ts     # Server auth guard
│   ├── types/
│   │   ├── user.ts             # User types
│   │   └── auth.ts             # Auth types
│   ├── refine/                 # Refine data providers
│   ├── graphql/                # GraphQL client setup
│   └── mongo.ts                # MongoDB connection & helpers
├── types/
│   └── next-auth.d.ts          # NextAuth type extensions
└── scripts/
    ├── seed-users.ts           # Database seeding script
    └── create-admin.ts         # Manual admin creation script
```

## API Routes

### Authentication

- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - List all users (without passwords)

### GraphQL

- `POST /api/graphql` - GraphQL endpoint for admin pages

## Usage

### Creating a User

```typescript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'secure-password'
  })
});
```

### Login

Navigate to `/auth/login` and enter your credentials, or use NextAuth programmatically:

```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'admin@example.com',
  password: 'your-password',
  callbackUrl: '/admin/dashboard'
});
```

### Protecting Routes

Server-side protection (in server components):

```typescript
import { requireAuth } from '@/lib/auth/server-guard';

export default async function ProtectedPage() {
  const session = await requireAuth(); // Redirects if not authenticated
  return <div>Protected content</div>;
}
```

Client-side protection (in client components):

```typescript
import { ClientAuthGuard } from '@/lib/auth/guard';

export default function ProtectedComponent() {
  return (
    <ClientAuthGuard>
      <div>Protected content</div>
    </ClientAuthGuard>
  );
}
```

## Development

### Adding New Shadcn Components

```bash
npx shadcn@latest add [component-name]
```

### Database Collections

- `users` - User accounts with hashed passwords
- `adminPages` - Dynamic admin page configurations

## Security Notes

- Passwords are hashed using bcrypt with cost factor 10
- Sessions are JWT-based (no database storage)
- Auth guards protect all `/admin/*` routes
- CSRF protection enabled by NextAuth

## Next Steps

- [ ] Add role-based access control
- [ ] Implement user management UI
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add audit logging
- [ ] Setup production MongoDB cluster

## License

MIT
