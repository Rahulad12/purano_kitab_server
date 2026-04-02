# Google OAuth Quick Start

## 1. Get Google Credentials (5 minutes)

Visit: https://console.cloud.google.com/

1. Create a new project
2. Enable Google+ API
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/google/callback`
5. Copy Client ID and Client Secret

## 2. Configure Backend

Update your `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

Start server:
```bash
npm run start:dev
```

## 3. Frontend Implementation (Choose One)

### Option A: Using React

Install:
```bash
npm install @react-oauth/google axios
```

Simple login button:
```jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function GoogleLogin() {
  const handleSuccess = async (credentialResponse) => {
    const response = await axios.post('/api/auth/google/callback', {
      code: credentialResponse.credential
    });
    
    localStorage.setItem('accessToken', response.data.data.accessToken);
    window.location.href = '/dashboard';
  };

  return <GoogleLogin onSuccess={handleSuccess} />;
}
```

### Option B: Manual URL Redirect

```javascript
// 1. Get login URL
const res = await fetch('/api/auth/google/authorization-url');
const { data } = await res.json();

// 2. Redirect user to Google
window.location.href = data.authorizationUrl;

// 3. After Google redirects back with code, exchange it
const code = new URL(window.location).searchParams.get('code');
const authRes = await fetch('/api/auth/google/callback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code })
});

const { data: authData } = await authRes.json();
localStorage.setItem('accessToken', authData.accessToken);
```

## 4. Test It

### Test login flow:
```bash
# 1. Get auth URL
curl http://localhost:3001/api/auth/google/authorization-url

# 2. Use that URL to login on Google
# 3. Get the authorization code from redirect
# 4. Exchange code for JWT token
curl -X POST http://localhost:3001/api/auth/google/callback \
  -H "Content-Type: application/json" \
  -d '{"code": "YOUR_CODE_HERE"}'

# 5. Use JWT token for API requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/your-endpoint
```

## 5. API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/auth/google/authorization-url` | Get Google login URL |
| POST | `/auth/google/callback` | Exchange code for JWT |
| POST | `/auth/google/refresh-token` | Refresh JWT (protected) |
| POST | `/auth/google/logout` | Logout user (protected) |
| POST | `/auth/google/verify-token` | Verify ID token |

## What's Included

✅ Full OAuth2 implementation
✅ Automatic user creation
✅ Token refresh support
✅ Secure refresh token storage
✅ TypeScript types
✅ Error handling
✅ Production-ready code
✅ Frontend examples (React & Vue)

## File Structure

```
New files:
- src/modules/auth/google-oauth.service.ts
- src/modules/auth/google-oauth.controller.ts
- src/modules/dto/google-oauth.dto.ts

Updated files:
- src/modules/auth/auth.module.ts
- src/modules/users/user.schema.ts
- .env.example

Documentation:
- GOOGLE_OAUTH_README.md (full docs)
- GOOGLE_OAUTH_SETUP.md (setup instructions)
- GOOGLE_OAUTH_QUICKSTART.md (this file)
```

## Next Steps

1. ✅ Get Google credentials
2. ✅ Update .env file
3. ✅ Test backend endpoints with curl
4. ✅ Implement frontend login
5. ✅ Test full OAuth flow
6. ✅ Deploy to production

## Troubleshooting

**Q: "GOOGLE_CLIENT_ID not found"**
A: Make sure .env has GOOGLE_CLIENT_ID set, then restart server

**Q: "Authorization code is invalid"**
A: Codes expire in 10 minutes. Get a new one.

**Q: Frontend keeps redirecting to login**
A: Check that JWT token is stored in localStorage after callback

**Q: CORS errors**
A: Make sure your frontend URL is allowed in Google Cloud console

## Support

Full documentation: See GOOGLE_OAUTH_README.md

Need help?
- Check the error message carefully
- Review GOOGLE_OAUTH_README.md
- Check logs: `npm run start:dev`
