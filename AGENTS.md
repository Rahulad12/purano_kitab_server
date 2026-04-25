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

# Database
yarn migrate       # Run database migration/seeding

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
├── migrate.ts             # Database migration script
├── shared/
│   ├── config/           # Configuration validation
│   │   ├── app.config.ts
│   │   └── env-config.dto.ts
│   ├── database/         # Database configuration
│   └── filters/         # Global exception filters
│       └── http-exception.filter.ts
├── modules/
│   ├── auth/            # Authentication module (JWT, Google OAuth)
│   ├── book/           # Book management module
│   ├── category/      # Book categories
│   ├── users/         # User management
│   └── favorite/     # User favorites
└── seed/
    └── book.seed.ts    # Database seeding (legacy)
```

## Environment Variables

See `.env.example` for required variables. Key ones:
- `DATABASE_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

## Features Added

### 1. Config Validation at Startup
Validates required environment variables on application start. App will fail fast if `DATABASE_URI` or `JWT_SECRET` are missing.

### 2. Global Exception Filter
All errors return standardized response format:
```json
{
  "success": false,
  "message": "Error message",
  "error": {},
  "statusCode": 500,
  "timestamp": "ISO date"
}
```

### 3. Rate Limiting
Built-in throttling:
- `short`: 10 requests per 10 seconds
- `medium`: 50 requests per 60 seconds

### 4. Unit Tests
Test files exist for:
- `src/modules/auth/auth.service.spec.ts`
- `src/modules/auth/auth.guard.spec.ts`
- `src/modules/users/user.service.spec.ts`
- `src/modules/book/book.service.spec.ts`

## Code Conventions

- Use class-validator DTOs for request validation
- Use Swagger decorators for API documentation
- Follow NestJS module patterns (imports, exports, providers)
- Use Mongoose decorators for schema definitions

## Adding New Modules

1. Create module: `nest g module <module-name>`
2. Create controller: `nest g controller <module-name>`
3. Create service: `nest g service <module-name>`
4. Create schema: `src/modules/<module-name>/<module-name>.schema.ts`

## Database

- Migration: `yarn migrate` - Seeds database with users, categories, and books
- Models are in respective module directories