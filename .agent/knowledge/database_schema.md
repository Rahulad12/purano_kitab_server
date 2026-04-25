# Database Schema

## MongoDB Collections

### users

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique ID |
| firstName | string | No | User's first name |
| lastName | string | No | User's last name |
| email | string | Yes | Email address |
| phoneNumber | string | No | Phone number |
| password | string | No | Hashed password |
| googleId | string | No | Google OAuth ID |
| googleRefreshToken | string | No | Google refresh token |
| isActive | boolean | No | Account active |
| isDeleted | boolean | No | Soft delete flag |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Update timestamp |

Indexes:
- `email` (unique)
- `googleId` (unique, sparse)

### books

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique ID |
| owner | ObjectId | Yes | User's ID (ref: users) |
| title | string | Yes | Book title |
| author | string | No | Book author |
| description | string | No | Book description |
| price | string | No | Price |
| image_url | string | No | Image URL |
| category | string | No | Category |
| isAvailable | boolean | No | Available for sale |
| isSold | boolean | No | Sold status |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Update timestamp |

Indexes:
- `owner` (ref)
- `isAvailable`

### favorites

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique ID |
| user | ObjectId | Yes | User's ID (ref: users) |
| book | ObjectId | Yes | Book's ID (ref: books) |
| createdAt | Date | Yes | Creation timestamp |

Indexes:
- `user` (ref)
- `book` (ref)
- `{ user, book }` (unique compound)

### categories

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Yes | Unique ID |
| name | string | Yes | Category name |
| createdAt | Date | Yes | Creation timestamp |
| updatedAt | Date | Yes | Update timestamp |

Indexes:
- `name` (unique)

## Relationships

```
User (1) ──────< Book (many)
User (1) ──────< Favorite (many)
Book (1) ──────< Favorite (many)
```