# Coding Rules

## Code Style

- **Language**: TypeScript
- **Framework**: NestJS v11
- **Linting**: ESLint with eslint-config-prettier
- **Formatting**: Prettier

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `UserController` |
| Interfaces | PascalCase | `CreateUserDto` |
| Types | PascalCase | `UserDocument` |
| Services | PascalCase | `UserService` |
| Controllers | PascalCase | `UserController` |
| Modules | PascalCase | `UserModule` |
| Files | kebab-case | `user.service.ts` |
| Tables/Collections | plural, kebab-case | `users`, `books` |

## Folder Structure

```
src/
├── main.ts                      # Application entry
├── app.module.ts              # Root module
├── modules/
│   ├── auth/                # Authentication (register, login, JWT)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── auth.guard.ts
│   │   ├── google-oauth.controller.ts
│   │   └── google-oauth.service.ts
│   ├── users/               # User management
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   └── user.schema.ts
│   ├── book/               # Book listing
│   │   ├── book.controller.ts
│   │   ├── book.service.ts
│   │   ├── book.module.ts
│   │   └── book.schema.ts
│   ├── favorite/           # Favorites
│   ├── category/           # Book categories
│   └── dto/                # Data Transfer Objects
├── shared/
│   └── database/           # DB configuration
└── seed/
    └── book.seed.ts        # Database seeding
```

## Best Practices

### Controllers
- Use `@ApiTags()` for Swagger grouping
- Use `@ApiParam()` for path parameters
- Use `@ApiBody()` for request bodies
- Return typed responses
- Use Logger for logging

### Services
- Use `@Injectable()` decorator
- Return typed Promises
- Handle errors with proper exceptions
- Use async/await pattern

### DTOs
- Use class-validator decorators
- Use class-transformer for transformation
- Document with Swagger decorators

### Mongoose Schemas
- Use `@Prop()` decorators
- Define proper types
- Use `timestamps: true` for auto `createdAt`/`updatedAt`

## Linting & Formatting

```bash
yarn lint    # Lint and fix
yarn format # Format code
```

## Testing

```bash
yarn test           # Unit tests
yarn test:watch   # Watch mode
yarn test:cov    # Coverage
yarn test:e2e    # E2E tests
```

## API Documentation

- Swagger available at `/api/docs`
- Use `@nestjs/swagger` decorators
- Group endpoints with `@ApiTags()`
- Document DTOs with `@ApiProperty()`