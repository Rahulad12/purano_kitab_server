# Architecture Rules

## System Boundaries

### Module Structure
Each feature is a self-contained module with:
- Controller (HTTP handlers)
- Service (business logic)
- Module (dependency injection)
- Schema (Mongoose model)

### Module Dependencies
```
AppModule (root)
├── DatabaseModule (shared DB connection)
├── AuthModule
│   └── UserModule
├── UserModule
├── BookModule
│   └── UserModule
├── FavoriteModule
│   ├── UserModule
│   └── BookModule
└── CategoryModule
```

## Separation of Concerns

| Layer | Responsibility |
|-------|---------------|
| Controller | HTTP request/response, validation |
| Service | Business logic, data operations |
| Schema | Data model, validations |
| DTO | Request/response transformation |
| Guard | Authentication/authorization |

## Backend Communication

### REST API Design
- Use standard HTTP methods (GET, POST, PUT, DELETE)
- Use proper status codes
- Return consistent response format
- Use DTOs for validation

### Authentication
- JWT-based authentication
- Google OAuth 2.0 support
- Protected routes via AuthGuard

### Database
- MongoDB with Mongoose
- Connection via DatabaseModule
- Seed data for development

## Environment Configuration

| Environment | Variables |
|-------------|-----------|
| All | `MONGODB_URI`, `JWT_SECRET` |
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` |

## API Versioning

- No versioning (v1 implied)
- Base path: `/api`
- Swagger: `/api/docs`

## Error Handling

- Use NestJS built-in exceptions
- Return consistent error format
- Log errors with Logger

## Security

- Never expose secrets in responses
- Hash passwords with bcrypt
- Validate all inputs with DTOs
- Use environment variables for secrets