# Agent Guidelines for Purano Kitab Server

## Project Overview

NestJS backend server for "Purano Kitab" (Old Book) application - a platform for buying/selling used books. Uses MongoDB with Mongoose, JWT authentication, and Google OAuth.

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Google OAuth
- **API Documentation**: Swagger
- **Language**: TypeScript
- **Testing**: Jest

## Commands

```bash
# Development
yarn start:dev      # Start with hot reload
yarn start:debug    # Start with debugging

# Build & Production
yarn build          # Build the project
yarn start:prod     # Run production build

# Testing
yarn test           # Run unit tests
yarn test:watch     # Run tests in watch mode
yarn test:cov       # Run tests with coverage
yarn test:e2e       # Run e2e tests

# Linting
yarn lint           # Lint and fix files
```

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── modules/
│   ├── users/              # User management module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.schema.ts
│   │   └── user.module.ts
│   └── book/               # Book management module
│       ├── book.controller.ts
│       ├── book.service.ts
│       ├── book.schema.ts
│       └── book.module.ts
├── shared/
│   └── database/           # Database configuration
└── seed/
    └── book.seed.ts        # Database seeding
```

## Environment Variables

See `.env.example` for required variables. Key ones:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## Adding New Modules

1. Create module: `nest g module <module-name>`
2. Create controller: `nest g controller <module-name>`
3. Create service: `nest g service <module-name>`
4. Create schema: `src/modules/<module-name>/<module-name>.schema.ts`

## Code Conventions

- Use class-validator DTOs for request validation
- Use Swagger decorators for API documentation
- Follow NestJS module patterns (imports, exports, providers)
- Use Mongoose decorators for schema definitions

## Database

- Seed data: Run via `dist/seed/book.seed.js` after building
- Models are in respective module directories