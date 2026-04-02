# Google OAuth 2.0 Service Implementation

## Overview

This implementation provides a complete, production-ready Google OAuth 2.0 service for your NestJS backend. It follows OAuth2 standards and is designed to be easily integrated with any frontend framework (React, Vue, Angular, etc.).

## Architecture

```
Frontend
   ↓
   ├─→ GET /auth/google/authorization-url (get login URL)
   │
   ├─→ User redirected to Google login
   │
   ├─→ Google redirects back with authorization code
   │
   ├─→ POST /auth/google/callback (exchange code for tokens)
   │
   ├─→ Backend exchanges code for Google tokens
   │
   ├─→ Backend creates/updates user in database
   │
   ├─→ Backend returns JWT token to frontend
   │
   ├─→ Frontend stores JWT and uses it for API requests
   │
   └─→ POST /auth/google/refresh-token (refresh JWT when needed)
```

## Features

- **OAuth2 Authorization Code Flow** - Most secure approach for web applications
- **Automatic Refresh Token Handling** - Backend manages token lifecycle
- **User Auto-Creation** - Creates new users on first login
- **Email Linking** - Links Google account to existing users with same email
- **Secure Storage** - Refresh tokens stored encrypted in MongoDB
- **JWT Authentication** - Returns standard JWT for API requests
- **Token Refresh Endpoint** - Easy token refresh for frontend
- **Logout Support** - Clear refresh tokens on logout
- **Error Handling** - Comprehensive error messages
- **TypeScript** - Full type safety throughout

## Installation

### Step 1: Install Dependencies

The following packages are already available in your project:
- `google-auth-library` - Google OAuth client
- `axios` - HTTP requests
- `@nestjs/jwt` - JWT handling
- `@nestjs/config` - Environment configuration

If not already installed, run:
```bash
npm install google-auth-library axios
```

### Step 2: Environment Configuration

Add to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-from-google-cloud.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-from-google-cloud
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
```

For production:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
```

### Step 3: Database Update

The User schema has been automatically updated with:
- `googleId` (String, unique, sparse) - Google user ID
- `googleRefreshToken` (String) - Stored refresh token

These are optional fields - users without Google authentication will have these as null.

## API Endpoints

### 1. Get Authorization URL

**Endpoint:** `GET /auth/google/authorization-url`

**Purpose:** Get the Google login URL to redirect user to

**Request:**
```bash
curl http://localhost:3001/api/auth/google/authorization-url
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Authorization URL generated",
  "data": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=..."
  }
}
```

**Frontend Usage:**
```javascript
// Get the authorization URL
const response = await fetch('/auth/google/authorization-url');
const { data } = await response.json();

// Redirect user to Google login
window.location.href = data.authorizationUrl;
```

---

### 2. OAuth Callback (Exchange Code for Tokens)

**Endpoint:** `POST /auth/google/callback`

**Purpose:** Exchange Google authorization code for tokens and create/update user

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/google/callback \
  -H "Content-Type: application/json" \
  -d '{
    "code": "4/0AWtgzBrnZGpF9KxZGpF9KxZG..."
  }'
```

**Response (Success):**
```json
{
  "statusCode": 200,
  "message": "Successfully authenticated with Google",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Response (Error):**
```json
{
  "statusCode": 401,
  "message": "Failed to authenticate with Google. Please try again.",
  "error": "Unauthorized"
}
```

**Frontend Usage:**
```javascript
// After user logs in with Google, they're redirected back with code
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

const response = await fetch('/auth/google/callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code })
});

const { data } = await response.json();

// Store the JWT token
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('user', JSON.stringify(data.user));

// Redirect to dashboard
window.location.href = '/dashboard';
```

---

### 3. Refresh Access Token

**Endpoint:** `POST /auth/google/refresh-token`

**Purpose:** Get a new JWT access token (protected endpoint)

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/google/refresh-token \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Frontend Usage:**
```javascript
// Automatically refresh token when it's about to expire
const refreshToken = async () => {
  const response = await fetch('/auth/google/refresh-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });

  const { data } = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  
  return data.accessToken;
};
```

---

### 4. Logout

**Endpoint:** `POST /auth/google/logout`

**Purpose:** Clear refresh token and logout user (protected endpoint)

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/google/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Successfully logged out"
}
```

**Frontend Usage:**
```javascript
const logout = async () => {
  await fetch('/auth/google/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });

  // Clear local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  // Redirect to login
  window.location.href = '/login';
};
```

---

### 5. Verify Token (Optional)

**Endpoint:** `POST /auth/google/verify-token`

**Purpose:** Verify and decode a Google ID token

**Request:**
```bash
curl -X POST http://localhost:3001/api/auth/google/verify-token \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ..."
  }'
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Token verified successfully",
  "data": {
    "sub": "107293139027000000000",
    "email": "user@example.com",
    "email_verified": true,
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "given_name": "John",
    "family_name": "Doe"
  }
}
```

---

## Frontend Integration Examples

### React with TypeScript

```typescript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Get authorization URL
      const authResponse = await apiClient.get('/auth/google/authorization-url');
      const authUrl = authResponse.data.data.authorizationUrl;

      // Step 2: Redirect to Google login
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate Google login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login with Google'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export function OAuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract authorization code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
          throw new Error('No authorization code found');
        }

        // Step 3: Exchange code for tokens
        const response = await apiClient.post<{ data: AuthResponse }>(
          '/auth/google/callback',
          { code }
        );

        // Step 4: Store tokens
        const { accessToken, user } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Step 5: Redirect to dashboard
        window.location.href = '/dashboard';
      } catch (err) {
        setError('Authentication failed. Please try again.');
        console.error(err);
        setLoading(false);
      }
    };

    handleCallback();
  }, []);

  return (
    <div>
      {loading ? <p>Processing authentication...</p> : null}
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}
    </div>
  );
}

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/google/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// Protected route wrapper
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
}
```

### Vue 3 with TypeScript

```vue
<template>
  <div class="login-container">
    <button 
      @click="handleGoogleLogin" 
      :disabled="loading"
      class="google-login-btn"
    >
      {{ loading ? 'Loading...' : 'Login with Google' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const loading = ref(false);
const error = ref<string | null>(null);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleGoogleLogin = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await apiClient.get('/auth/google/authorization-url');
    window.location.href = response.data.data.authorizationUrl;
  } catch (err) {
    error.value = 'Failed to initiate Google login';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  text-align: center;
  padding: 20px;
}

.google-login-btn {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
}

.google-login-btn:hover:not(:disabled) {
  background-color: #357ae8;
}

.google-login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
```

## Setting up Google Cloud OAuth

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name (e.g., "Purano Kitab")
4. Click "Create"

### Step 2: Enable Google+ API

1. In the search bar, search for "Google+ API"
2. Click "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to **Credentials** (left sidebar)
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Add Authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/google/callback`
   - `https://yourdomain.com/auth/callback` (production)
5. Click "Create"

### Step 4: Copy Your Credentials

1. Copy the **Client ID**
2. Copy the **Client Secret**
3. Add to your `.env` file

## Security Best Practices

1. **Keep Client Secret Private** - Never expose it to the frontend
2. **Use HTTPS in Production** - OAuth requires secure connections
3. **Validate Redirect URIs** - Only use approved URIs in Google Cloud
4. **Store Tokens Securely** - Use HttpOnly cookies if possible
5. **Implement CSRF Protection** - Use state parameter for validation
6. **Set Token Expiration** - Use short-lived JWT tokens
7. **Revoke on Logout** - Clear tokens from database
8. **Monitor for Suspicious Activity** - Track failed login attempts

## File Structure

```
src/
├── modules/
│   └── auth/
│       ├── auth.service.ts (existing)
│       ├── auth.controller.ts (existing)
│       ├── auth.module.ts (updated)
│       ├── google-oauth.service.ts (NEW)
│       ├── google-oauth.controller.ts (NEW)
│       └── auth.guard.ts (existing)
├── modules/
│   └── users/
│       ├── user.schema.ts (updated with googleId, googleRefreshToken)
│       ├── user.service.ts
│       └── user.module.ts
└── modules/
    └── dto/
        └── google-oauth.dto.ts (NEW)
```

## Testing the Implementation

### Using cURL

```bash
# 1. Get authorization URL
curl http://localhost:3001/api/auth/google/authorization-url

# 2. After getting code from Google, exchange it
curl -X POST http://localhost:3001/api/auth/google/callback \
  -H "Content-Type: application/json" \
  -d '{"code": "YOUR_AUTHORIZATION_CODE"}'

# 3. Refresh token
curl -X POST http://localhost:3001/api/auth/google/refresh-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Logout
curl -X POST http://localhost:3001/api/auth/google/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### Issue: "GOOGLE_CLIENT_ID not configured"
- Make sure `.env` file has `GOOGLE_CLIENT_ID` set
- Restart the server after updating `.env`

### Issue: "Invalid authorization code"
- Authorization codes expire after 10 minutes
- Ensure code hasn't been used already
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct

### Issue: "Token refresh fails"
- Ensure refresh token is stored in database
- Check user hasn't revoked permissions in Google account
- Verify GOOGLE_CLIENT_SECRET is correct

### Issue: CORS errors
- Add frontend URL to CORS configuration if needed
- Check that redirect URIs match in Google Cloud console

## Production Deployment

1. **Set environment variables** in production:
   ```env
   GOOGLE_CLIENT_ID=prod-client-id
   GOOGLE_CLIENT_SECRET=prod-client-secret
   GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
   ```

2. **Update Google Cloud console** with production redirect URIs

3. **Use HTTPS** for all OAuth endpoints

4. **Enable rate limiting** to prevent brute force attacks

5. **Monitor token refresh rates** for suspicious activity

6. **Set up logging** for authentication events

## Support

For issues or questions about Google OAuth:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OpenID Connect for Google](https://developers.google.com/identity/openid-connect)
