# Architecture

## High-Level Architecture

```
┌─────────────┐
│  Frontend   │  (React/Vue/Angular)
└──────┬──────┘
       │ HTTP/S
       ▼
┌─────────────┐
│  NestJS    │  Backend API
│  Server    │  (Port 3001)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │  Database
└─────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS v11 |
| Language | TypeScript |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | JWT |
| OAuth | Google OAuth 2.0 |
| Docs | Swagger |

## Module Architecture

```
AppModule
├── DatabaseModule      (Mongoose connection)
├── AuthModule       (JWT, OAuth)
│   └── UserModule
├── UserModule       (User management)
├── BookModule      (Book listings)
│   └── UserModule
├── FavoriteModule  (Book favorites)
│   ├── UserModule
│   └── BookModule
└── CategoryModule (Book categories)
```

## Request Flow

```
HTTP Request
  │
  ▼
Controller (validates, routes)
  │
  ▼
Service (business logic)
  │
  ▼
Database (Mongoose)
  │
  ▼
Response (JSON)
```

## Security

- JWT tokens for authentication
- Google OAuth 2.0 for social login
- Bcrypt for password hashing
- Environment variables for secrets

## API Documentation

Swagger UI available at: `/api/docs`