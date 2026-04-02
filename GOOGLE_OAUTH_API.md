# Google OAuth API Documentation (Expo Native)

## Overview

This API enables Google OAuth authentication for **Expo (React Native)** applications using the **Authorization Code Flow**.


## Endpoints
### 1. Get Authorization URL

Returns the Google OAuth authorization URL to open in the browser.

**Endpoint:**
```http
GET /auth/google/authorization-url
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Authorization URL generated",
  "data": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
  }
}
```


### 2. Exchange Code for Tokens

Exchanges the authorization code (from the callback) for a JWT access token and user information.

**Endpoint:**
```http
POST /auth/google/callback
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "string"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Successfully authenticated with Google",
  "data": {
    "accessToken": "jwt_token_for_your_app",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```


---

### 3. Refresh Access Token

Refreshes the access token using the stored refresh token. Requires authentication.

**Endpoint:**
```http
POST /auth/google/refresh-token
Authorization: Bearer {your_jwt_token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "new_jwt_token",
    "expiresIn": 3600
  }
}
```

---

### 4. Logout

Revokes Google tokens and clears the stored refresh token. Requires authentication.

**Endpoint:**
```http
POST /auth/google/logout
Authorization: Bearer {your_jwt_token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Successfully logged out"
}
```

---

### 5. Verify Google ID Token (Optional)

Verifies a Google ID token for additional security checks.

**Endpoint:**
```http
POST /auth/google/verify-token
Content-Type: application/json
```

**Request Body:**
```json
{
  "idToken": "string"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Token verified successfully",
  "data": {
    "sub": "google_user_id",
    "email": "user@example.com",
    "email_verified": true,
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

---

