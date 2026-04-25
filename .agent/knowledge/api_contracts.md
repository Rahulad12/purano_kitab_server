# API Contracts

## Base URL

```
Development: http://localhost:3001/api
Production: https://api.puranokitab.com/api
```

## Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | No | Register new user |
| `/auth/login` | POST | No | Login with email/password |
| `/auth/google/authorization-url` | GET | No | Get Google OAuth URL |
| `/auth/google/callback` | POST | No | Exchange Google code |
| `/auth/google/refresh-token` | POST | JWT | Refresh JWT token |
| `/auth/google/logout` | POST | JWT | Logout user |

## User Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/users/me` | GET | JWT | Get current user |
| `/users/all-users` | GET | JWT | Get all users |
| `/users/change-password` | POST | JWT | Change password |
| `/users/change-email-or-phone` | POST | JWT | Change email/phone |

## Book Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/books` | GET | No | Get all books (paginated) |
| `/books` | POST | JWT | Create new book |
| `/books/:id` | GET | No | Get book by ID |
| `/books/:id` | DELETE | JWT | Delete book |
| `/books/user` | GET | JWT | Get user's books |
| `/books/featured` | GET | No | Get featured books |
| `/books/user/matrix` | GET | JWT | Get user's book stats |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| search | string | - | Search by title |
| author | string | - | Filter by author |
| category | string | - | Filter by category |
| minPrice | number | - | Minimum price |
| maxPrice | number | - | Maximum price |

## Favorite Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/favorites` | GET | JWT | Get user's favorites |
| `/favorites` | POST | JWT | Add to favorites |
| `/favorites/:bookId` | DELETE | JWT | Remove from favorites |

## Category Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/categories` | GET | No | Get all categories |
| `/categories` | POST | JWT | Create category |
| `/categories/:id` | DELETE | JWT | Delete category |

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error

```json
{
  "statusCode": 400,
  "message": "Error message"
}
```