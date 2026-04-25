# Debugging Skill

## Purpose

Identify, trace, and resolve errors in the Purano Kitab backend.

## When to Use

- Application errors
- API failures
- Authentication issues
- Database errors

## Execution Strategy

### 1. Error Classification

| Error Type | Where to Look |
|-----------|---------------|
| 4xx errors | Controller, DTO validation |
| 5xx errors | Service, database |
| Auth errors | AuthGuard, JWT service |
| DB errors | Mongoose connection, schema |

### 2. Logging

NestJS uses built-in Logger:
```typescript
private readonly logger = new Logger(ClassName.name);

this.logger.log('Operation started');
this.logger.error('Error occurred', error.stack);
```

### 3. Common Issues

#### **"User not authenticated"**
- Check AuthGuard validates token
- Verify JWT_SECRET matches
- Check token in request header

#### **"Invalid Request" (401)**
- Token expired or invalid
- Re-authenticate with fresh token

#### **"Cannot read property of undefined"**
- Check if data exists before access
- Add null checks

#### **"Mongoose connection failed""**
- Check MONGODB_URI
- Verify MongoDB is running

### 4. Debug Commands

```bash
# Run with debug
yarn start:debug

# Check logs
# Ensure Logger is being used

# Test endpoints
curl http://localhost:3001/api/books
```

### 5. Testing

```bash
# Unit tests
yarn test

# Watch mode
yarn test:watch

# Coverage
yarn test:cov

# E2E tests
yarn test:e2e
```

## Swagger

Access `/api/docs` for API documentation and testing.

## Steps for New Issues

1. Identify error type (4xx, 5xx, auth, db)
2. Check relevant logs
3. Verify request/response format
4. Test with Swagger or cURL
5. Check environment variables
6. Run tests