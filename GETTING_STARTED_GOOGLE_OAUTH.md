# 🎯 Google OAuth Implementation - Getting Started

## ✅ What's Ready

Your Google OAuth 2.0 service is **fully implemented** and ready to use!

### Implementation Complete ✅
- **Backend Service**: GoogleOAuthService with all required methods
- **API Endpoints**: 5 REST endpoints ready to use
- **Database**: User schema updated with Google fields
- **Type Safety**: Full TypeScript implementation
- **Documentation**: 5 comprehensive guides
- **Examples**: React and Vue frontend examples included
- **Security**: OAuth2 best practices implemented

---

## 🚀 Quick Start (Follow These Steps)

### STEP 1: Get Google OAuth Credentials (15 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create a new project
   - Click "Select a Project"
   - Click "New Project"
   - Enter name: "Purano Kitab"
   - Click "Create"

3. Enable Google+ API
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials
   - Click "Credentials" in left menu
   - Click "Create Credentials"
   - Select "OAuth client ID"
   - Choose "Web application"
   - Add these Authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     http://localhost:3001/auth/google/callback
     ```
   - Click "Create"

5. Copy Your Credentials
   - Copy "Client ID"
   - Copy "Client Secret"

### STEP 2: Configure Your Backend (5 minutes)

1. Open `.env` file in your project root

2. Add these lines:
```env
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

3. Save the file

### STEP 3: Start Your Backend (2 minutes)

```bash
npm run start:dev
```

You should see output like:
```
[Nest] 12:34:56 [NestFactory] Starting Nest application...
[Nest] 12:34:57 [InstanceLoader] AuthModule dependencies initialized +123ms
✓ Server is running on http://localhost:3001
```

### STEP 4: Test the Backend (5 minutes)

Open a terminal and run:

```bash
curl http://localhost:3001/api/auth/google/authorization-url
```

You should see a response with a Google OAuth URL. If you see an error, check:
- Is the server running?
- Are the .env variables set correctly?
- Did you restart the server after adding .env?

### STEP 5: Implement Frontend (1-2 hours)

Choose your framework:

#### Option A: React
```bash
npm install @react-oauth/google axios
```

Create a login component:
```jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/google/callback',
        { code: credentialResponse.credential }
      );

      // Save the JWT token
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}
```

#### Option B: Vue
```vue
<template>
  <button @click="handleGoogleLogin">
    Login with Google
  </button>
</template>

<script setup>
import axios from 'axios';

const handleGoogleLogin = async () => {
  try {
    const response = await axios.get(
      'http://localhost:3001/api/auth/google/authorization-url'
    );
    window.location.href = response.data.data.authorizationUrl;
  } catch (error) {
    console.error('Error:', error);
  }
};
</script>
```

---

## 📚 Documentation Guide

Read these in order:

1. **START HERE** → `README_GOOGLE_OAUTH.md` (this file)
   - Overview and getting started

2. **Quick Reference** → `GOOGLE_OAUTH_QUICKSTART.md` (5 min read)
   - Fast setup summary
   - Testing with cURL
   - Frontend examples

3. **Detailed Setup** → `GOOGLE_OAUTH_SETUP.md` (20 min read)
   - Backend configuration
   - Frontend integration
   - Advanced topics

4. **Complete Reference** → `GOOGLE_OAUTH_README.md` (30 min read)
   - Full API documentation
   - Detailed examples
   - Security best practices
   - Troubleshooting

5. **Progress Tracking** → `GOOGLE_OAUTH_IMPLEMENTATION_CHECKLIST.md`
   - Checklist of all tasks
   - What's complete ✅
   - What's remaining ⏳

---

## 🧪 Testing Your Implementation

### Test 1: Check Backend is Running
```bash
curl http://localhost:3001/api/auth/google/authorization-url
```
Expected: Returns a Google OAuth URL

### Test 2: Get Authorization URL with Frontend
```javascript
// In your browser console
fetch('http://localhost:3001/api/auth/google/authorization-url')
  .then(r => r.json())
  .then(data => console.log(data.data.authorizationUrl))
  .catch(console.error)
```

### Test 3: Complete OAuth Flow
1. Get authorization URL (step above)
2. Visit that URL in your browser
3. Sign in with Google account
4. You'll be redirected back with a code
5. Check if JWT token is in localStorage

---

## 🎯 API Endpoints Reference

### 1. Get Authorization URL
```
GET /auth/google/authorization-url

Response:
{
  "statusCode": 200,
  "message": "Authorization URL generated",
  "data": {
    "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

### 2. Exchange Code for JWT
```
POST /auth/google/callback

Request Body:
{
  "code": "authorization-code-from-google"
}

Response:
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

### 3. Refresh Token
```
POST /auth/google/refresh-token
Authorization: Bearer {accessToken}

Response:
{
  "statusCode": 200,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "new-jwt-token",
    "expiresIn": 86400
  }
}
```

### 4. Logout
```
POST /auth/google/logout
Authorization: Bearer {accessToken}

Response:
{
  "statusCode": 200,
  "message": "Successfully logged out"
}
```

---

## 🔍 File Structure

### New Files (Backend)
```
src/modules/auth/
├── google-oauth.service.ts (NEW - OAuth logic)
├── google-oauth.controller.ts (NEW - 5 endpoints)
└── ...

src/modules/dto/
├── google-oauth.dto.ts (NEW - DTOs)
└── ...
```

### Updated Files
```
src/modules/auth/
├── auth.module.ts (UPDATED - added GoogleOAuthService)
└── ...

src/modules/users/
├── user.schema.ts (UPDATED - googleId, googleRefreshToken fields)
└── ...
```

### Documentation Files
```
README_GOOGLE_OAUTH.md (Overview - you are here)
GOOGLE_OAUTH_QUICKSTART.md (5-min quick start)
GOOGLE_OAUTH_SETUP.md (Detailed setup)
GOOGLE_OAUTH_README.md (Complete reference)
GOOGLE_OAUTH_IMPLEMENTATION_SUMMARY.md (Summary)
GOOGLE_OAUTH_IMPLEMENTATION_CHECKLIST.md (Progress tracking)
```

---

## 🛠️ Common Tasks

### Task 1: Test Backend Endpoints

```bash
# Get auth URL
curl http://localhost:3001/api/auth/google/authorization-url

# Exchange code (replace CODE with actual code)
curl -X POST http://localhost:3001/api/auth/google/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"YOUR_CODE"}'

# Refresh token (replace TOKEN with actual JWT)
curl -X POST http://localhost:3001/api/auth/google/refresh-token \
  -H "Authorization: Bearer YOUR_TOKEN"

# Logout
curl -X POST http://localhost:3001/api/auth/google/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Task 2: Store JWT Token in Frontend

```javascript
// After successful login
const accessToken = response.data.data.accessToken;
const user = response.data.data.user;

// Store in localStorage
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('user', JSON.stringify(user));

// Or use sessionStorage for security
sessionStorage.setItem('accessToken', accessToken);
```

### Task 3: Use Token for API Requests

```javascript
// Setup axios interceptor
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api'
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Now all requests include the token automatically
const response = await apiClient.get('/protected-endpoint');
```

### Task 4: Handle Token Expiration

```javascript
// Auto-refresh token before expiration
const refreshToken = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/auth/google/refresh-token',
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    // Store new token
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data.accessToken;
  } catch (error) {
    // Redirect to login if refresh fails
    localStorage.clear();
    window.location.href = '/login';
  }
};

// Call before token expires
setInterval(refreshToken, 24 * 60 * 60 * 1000); // Daily
```

---

## ⚠️ Common Issues & Solutions

### Issue: "GOOGLE_CLIENT_ID not configured"
**Solution:**
1. Check `.env` file exists and has GOOGLE_CLIENT_ID
2. Verify no typos in variable name
3. Restart server after updating .env
4. Check that values don't have quotes

### Issue: "Invalid authorization code"
**Solution:**
1. Authorization codes expire after 10 minutes
2. Get a fresh code from Google
3. Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
4. Check that GOOGLE_REDIRECT_URI matches in Google Cloud console

### Issue: "CORS Error"
**Solution:**
1. Make sure backend is running on the right port (3001)
2. Check frontend is calling correct API URL
3. Verify Authorization header is set correctly
4. Add frontend URL to CORS if needed

### Issue: "Token not saved in localStorage"
**Solution:**
1. Check browser console for errors
2. Verify API response includes accessToken
3. Check localStorage is not disabled
4. Try using sessionStorage instead
5. Check for browser privacy settings

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] Get production Google OAuth credentials
- [ ] Update `.env` with production values
- [ ] Change GOOGLE_REDIRECT_URI to production domain
- [ ] Enable HTTPS on production domain
- [ ] Update Google Cloud console with production redirect URIs
- [ ] Test full OAuth flow on production
- [ ] Set up error logging/monitoring
- [ ] Set up rate limiting
- [ ] Test token refresh
- [ ] Test logout functionality
- [ ] Monitor logs for errors

---

## 📞 Need Help?

### Check These Resources

1. **Setup not working?**
   - Read: `GOOGLE_OAUTH_QUICKSTART.md`
   - Check: `.env` file is correct
   - Check: Server is running

2. **Frontend not working?**
   - Read: `GOOGLE_OAUTH_SETUP.md`
   - Check: API URL is correct
   - Check: Token is being stored

3. **Advanced questions?**
   - Read: `GOOGLE_OAUTH_README.md`
   - Check: Examples for your framework
   - Search: "Google OAuth 2.0" in docs

4. **Specific errors?**
   - Read: Troubleshooting section in `GOOGLE_OAUTH_README.md`
   - Check: Server logs
   - Check: Browser console

---

## ✅ You're Ready!

Your Google OAuth implementation is complete and ready to use:

✅ Backend service is implemented
✅ API endpoints are ready
✅ Database is updated
✅ Documentation is complete
✅ Examples are provided
✅ Security is configured

**Next Steps:**
1. Add your Google credentials to `.env`
2. Start the backend server
3. Test with the provided examples
4. Implement frontend for your app
5. Deploy to production

---

**Happy coding! 🚀**

Questions? Check the documentation files or refer to:
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [NestJS Docs](https://docs.nestjs.com)
- [JWT.io](https://jwt.io)
