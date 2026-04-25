# Business Logic

## User Authentication

### Registration
1. Validate input with CreateUserDto
2. Check if email exists
3. Hash password with bcrypt (cost: 10)
4. Create user in database
5. Return success response

### Login
1. Find user by email
2. Compare password with bcrypt
3. Generate JWT token
4. Return token and user

### Google OAuth
1. Generate Google authorization URL
2. Redirect user to Google
3. Exchange code for tokens
4. Verify ID token
5. Create/update user with googleId
6. Generate JWT token

## Book Management

### Create Book
1. Get user ID from JWT
2. Validate input with CreateBookDto
3. Create book with owner = userId
4. Return success

### Search Books
1. Build MongoDB query from filters
2. Support: search, author, category, minPrice, maxPrice
3. Apply pagination (skip, limit)
4. Sort by createdAt descending
5. Return books

### Featured Books
1. Use aggregation pipeline
2. Lookup favorites collection
3. Filter books with favorites >= 1
4. Sort by favorite count

## Favorites

### Add to Favorites
1. Check if book exists
2. Check if already favorited
3. Create favorite record
4. Return success

### Remove from Favorites
1. Find favorite by user and book
2. Delete favorite record
3. Return success

## Statistics

### Seller Matrix
1. Get all books by user
2. Count favorites for each book
3. Filter sold books
4. Return stats object

## Common Rules

- Passwords must be hashed with bcrypt
- All inputs must be validated with DTOs
- Use proper HTTP status codes
- Return consistent response format
- Log all operations with Logger