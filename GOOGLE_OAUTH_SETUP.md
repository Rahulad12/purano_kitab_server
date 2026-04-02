# Google OAuth Implementation Guide

## Backend Setup

### 1. Environment Variables

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 2. Database

The User schema has been updated with:
- `googleId`: Unique Google user identifier
- `googleRefreshToken`: Stored refresh token for token refresh

### 3. Endpoints

#### Authentication Endpoints

**1. Get Authorization URL**
```
GET /auth/google/authorization-url
```

Response:
```json
{
  "statusCode": 200,
  "message": "Authorization URL generated",
  "data": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

**2. Handle OAuth Callback (Exchange Code for Tokens)**
```
POST /auth/google/callback
Content-Type: application/json

{
  "code": "authorization-code-from-google"
}
```

Response:
```json
{
  "statusCode": 200,
  "message": "Successfully authenticated with Google",
  "data": {
    "accessToken": "jwt-token-for-api",
    "user": {
      "id": "user-mongo-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**3. Refresh Access Token (Protected)**
```
POST /auth/google/refresh-token
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "statusCode": 200,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "new-jwt-token",
    "expiresIn": 3600
  }
}
```

**4. Logout (Protected)**
```
POST /auth/google/logout
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "statusCode": 200,
  "message": "Successfully logged out"
}
```

**5. Verify Token**
```
POST /auth/google/verify-token
Content-Type: application/json

{
  "idToken": "google-id-token"
}
```

---

## Frontend Implementation

### React Example

#### 1. Install Dependencies
```bash
npm install @react-oauth/google axios
```

#### 2. Set up Google Login Component

```jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export function GoogleAuthComponent() {
  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the authorization code to your backend
      const response = await axios.post(
        `${API_BASE_URL}/auth/google/callback`,
        {
          code: credentialResponse.credential, // This is the ID token from Google
        }
      );

      // Store the JWT token from your backend
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

#### 3. Get Authorization URL (Alternative Approach)

```jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export function GoogleLoginPage() {
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/auth/google/authorization-url`
        );
        setAuthUrl(response.data.data.authorizationUrl);
      } catch (error) {
        console.error('Failed to get auth URL:', error);
      }
    };

    fetchAuthUrl();
  }, []);

  return (
    <a href={authUrl}>
      <button>Login with Google</button>
    </a>
  );
}
```

#### 4. Handle Callback in Your Application

```jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      axios
        .post(`${API_BASE_URL}/auth/google/callback`, { code })
        .then((response) => {
          // Store tokens
          localStorage.setItem('accessToken', response.data.data.accessToken);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));

          // Redirect to dashboard
          window.location.href = '/dashboard';
        })
        .catch((error) => {
          console.error('OAuth callback failed:', error);
          window.location.href = '/login';
        });
    }
  }, [searchParams]);

  return <div>Processing authentication...</div>;
}
```

#### 5. API Utility with Token Management

```jsx
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/google/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        // Update token
        localStorage.setItem('accessToken', response.data.data.accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

#### 6. Logout Implementation

```jsx
export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/google/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

#### 7. Protected Route Wrapper

```jsx
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### Vue.js Example

```vue
<template>
  <div class="login-container">
    <button @click="handleGoogleLogin">Login with Google</button>
    <a v-if="authUrl" :href="authUrl">Redirect Login</a>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const authUrl = ref('');
const API_BASE_URL = 'http://localhost:3001/api';

onMounted(async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/google/authorization-url`
    );
    authUrl.value = response.data.data.authorizationUrl;
  } catch (error) {
    console.error('Failed to get auth URL:', error);
  }
});

const handleGoogleLogin = async (credentialResponse) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/google/callback`,
      {
        code: credentialResponse.credential,
      }
    );

    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));

    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};
</script>
```

---

## Google Cloud Setup

### 1. Create Google OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `http://localhost:3001/auth/google/callback` (backend development)
   - Your production URLs

### 2. Get Your Credentials

- Copy `Client ID` → `GOOGLE_CLIENT_ID`
- Copy `Client Secret` → `GOOGLE_CLIENT_SECRET`

---

## Key Features

✅ **OAuth2 Authorization Code Flow** - Most secure for web applications
✅ **Automatic Token Refresh** - Backend handles token lifecycle
✅ **User Auto-Create** - New users created on first login
✅ **Existing User Support** - Links Google account to existing email
✅ **Secure Token Storage** - Refresh tokens stored securely in database
✅ **Standard JWT Response** - Easy integration with existing auth
✅ **TypeScript Support** - Full type safety
✅ **Error Handling** - Comprehensive error messages

---

## Security Considerations

1. **Never expose GOOGLE_CLIENT_SECRET** - Keep it server-side only
2. **Use HTTPS in production** - OAuth requires secure connections
3. **Validate refresh tokens** - Check token validity before use
4. **Store JWT tokens** - Use HttpOnly cookies if possible
5. **Implement CSRF protection** - For state parameter validation
6. **Token expiration** - Set appropriate expiration times
7. **Revoke on logout** - Clear tokens from database

---

## Troubleshooting

### Common Issues

**Invalid authorization code**
- Ensure code hasn't expired (usually 10 minutes)
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Verify redirect URI matches in Google Console

**Token refresh fails**
- Ensure refresh token is stored in database
- Check if user hasn't revoked permissions
- Validate GOOGLE_CLIENT_SECRET

**CORS errors**
- Make sure frontend URL is allowed
- Configure CORS in your NestJS app if needed

**User not created**
- Verify MongoDB connection
- Check User schema fields are correct

---

## Next Steps

1. Set up Google Cloud OAuth credentials
2. Update `.env` with your Google credentials
3. Implement frontend components from examples above
4. Test authentication flow
5. Deploy with production Google credentials
