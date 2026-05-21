# Auth Flow API Artifact

## Goal

Make the current static/auth demo flow dynamic with real authentication APIs.

Current auth areas:

- `src/components/auth/login-screen.tsx`
  - Email entry
  - Continue button
  - Social login buttons
  - Create account link
- `src/components/auth/email-screen.tsx`
  - Signup email field
  - Password field
  - Password show/hide
  - Cloudflare verification UI
  - Create account button
  - Back to login link
- `src/components/auth/login-dialog.tsx`
  - Landing modal entry to `/login`
- `src/store/flow-store.ts`
  - Temporary email transfer between `/login` and `/signup`

## Routes

```txt
/login
/signup
/dashboard
```

Recommended final routes:

```txt
/login
/signup
/forgot-password
/reset-password
/verify-email
/dashboard
```

## Core Entities

### Auth User

```ts
type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  provider: "email" | "google" | "github" | "apple";
  createdAt: string;
  updatedAt: string;
};
```

### Auth Session

```ts
type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
};
```

### Auth Error

```ts
type AuthError = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};
```

## API List

### 1. Check Email

Use in:

- `/login`
- User enters email and clicks `Continue`
- Decide whether to continue login or signup flow

Endpoint:

```http
POST /api/auth/check-email
```

Payload:

```json
{
  "email": "rahul@example.com"
}
```

Response if user exists:

```json
{
  "success": true,
  "data": {
    "exists": true,
    "email": "rahul@example.com",
    "loginMethods": ["email", "google"],
    "emailVerified": true
  }
}
```

Response if user does not exist:

```json
{
  "success": true,
  "data": {
    "exists": false,
    "email": "rahul@example.com",
    "loginMethods": [],
    "emailVerified": false
  }
}
```

Frontend behavior:

```ts
if (data.exists) {
  showPasswordLogin();
} else {
  setEmail(email);
  router.push("/signup");
}
```

### 2. Email Login

Use in:

- `/login`
- When existing user signs in with email/password

Endpoint:

```http
POST /api/auth/login
```

Payload:

```json
{
  "email": "rahul@example.com",
  "password": "Password123",
  "rememberMe": true
}
```

Response:

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2026-05-21T12:30:00.000Z",
    "user": {
      "id": "user_001",
      "name": "Rahul Mukati",
      "email": "rahul@example.com",
      "avatarUrl": null,
      "emailVerified": true,
      "provider": "email",
      "createdAt": "2026-05-21T10:00:00.000Z",
      "updatedAt": "2026-05-21T10:00:00.000Z"
    }
  }
}
```

Frontend behavior:

```ts
saveSession(data);
router.push("/dashboard");
```

### 3. Create Account

Use in:

- `/signup`
- User enters email/password and clicks `Create your account`

Endpoint:

```http
POST /api/auth/signup
```

Payload:

```json
{
  "email": "rahul@example.com",
  "password": "Password123",
  "name": "Rahul Mukati",
  "turnstileToken": "cloudflare_turnstile_token"
}
```

Response:

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "requiresEmailVerification": true,
    "user": {
      "id": "user_001",
      "name": "Rahul Mukati",
      "email": "rahul@example.com",
      "avatarUrl": null,
      "emailVerified": false,
      "provider": "email",
      "createdAt": "2026-05-21T10:00:00.000Z",
      "updatedAt": "2026-05-21T10:00:00.000Z"
    }
  }
}
```

Frontend behavior:

```ts
router.push("/verify-email");
```

If app should login directly after signup:

```json
{
  "success": true,
  "data": {
    "requiresEmailVerification": false,
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2026-05-21T12:30:00.000Z",
    "user": {}
  }
}
```

Then:

```ts
router.push("/dashboard");
```

### 4. Verify Cloudflare Turnstile

Use in:

- `/signup`
- Before account creation or inside backend signup API

Recommended:

- Do verification inside `POST /api/auth/signup`
- Do not trust frontend verification only

Endpoint:

```http
POST /api/auth/verify-human
```

Payload:

```json
{
  "turnstileToken": "cloudflare_turnstile_token"
}
```

Response:

```json
{
  "success": true,
  "message": "Verification successful"
}
```

Error response:

```json
{
  "success": false,
  "message": "Human verification failed"
}
```

### 5. Send Email Verification

Use in:

- After signup
- Resend verification button

Endpoint:

```http
POST /api/auth/email/verification/send
```

Payload:

```json
{
  "email": "rahul@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "Verification email sent"
}
```

### 6. Verify Email

Use in:

- `/verify-email?token=...`
- Email verification link

Endpoint:

```http
POST /api/auth/email/verification/confirm
```

Payload:

```json
{
  "token": "email_verification_token"
}
```

Response:

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2026-05-21T12:30:00.000Z",
    "user": {
      "id": "user_001",
      "email": "rahul@example.com",
      "emailVerified": true
    }
  }
}
```

Frontend behavior:

```ts
saveSession(data);
router.push("/dashboard");
```

### 7. Start Social Login

Use in:

- Login screen social buttons
- Signup screen social buttons if added

Endpoint:

```http
GET /api/auth/oauth/{provider}/start
```

Supported providers:

```txt
google
github
apple
```

Query params:

```ts
{
  redirectTo?: string; // "/dashboard"
}
```

Example:

```http
GET /api/auth/oauth/google/start?redirectTo=/dashboard
```

Response:

```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

Frontend behavior:

```ts
window.location.href = data.authUrl;
```

### 8. Social Login Callback

Use in:

- OAuth provider redirects back to app

Endpoint:

```http
GET /api/auth/oauth/{provider}/callback
```

Query params from provider:

```ts
{
  code: string;
  state: string;
}
```

Backend response behavior:

- Validate OAuth state
- Create user if first login
- Create session
- Redirect to frontend route

Recommended redirect:

```http
302 /dashboard
```

Alternative JSON response:

```json
{
  "success": true,
  "data": {
    "accessToken": "access_token_here",
    "refreshToken": "refresh_token_here",
    "expiresAt": "2026-05-21T12:30:00.000Z",
    "user": {
      "id": "user_001",
      "email": "rahul@example.com",
      "provider": "google",
      "emailVerified": true
    }
  }
}
```

### 9. Get Current Session

Use in:

- App layout/session guard
- `/dashboard` protected route
- Restore user after refresh

Endpoint:

```http
GET /api/auth/session
```

Headers:

```http
Authorization: Bearer {accessToken}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_001",
      "name": "Rahul Mukati",
      "email": "rahul@example.com",
      "avatarUrl": null,
      "emailVerified": true,
      "provider": "email"
    }
  }
}
```

Unauthenticated:

```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

Frontend behavior:

```ts
if (!session) router.push("/login");
```

### 10. Refresh Session

Use in:

- Token refresh interceptor
- Page reload if access token expired

Endpoint:

```http
POST /api/auth/session/refresh
```

Payload:

```json
{
  "refreshToken": "refresh_token_here"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresAt": "2026-05-21T13:30:00.000Z"
  }
}
```

### 11. Logout

Use in:

- Account menu -> `Sign out`

Endpoint:

```http
POST /api/auth/logout
```

Payload:

```json
{
  "refreshToken": "refresh_token_here"
}
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

Frontend behavior:

```ts
clearSession();
router.push("/login");
```

### 12. Forgot Password

Use in:

- `/forgot-password`
- Login screen forgot password link

Endpoint:

```http
POST /api/auth/password/forgot
```

Payload:

```json
{
  "email": "rahul@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "If the email exists, reset instructions were sent"
}
```

### 13. Reset Password

Use in:

- `/reset-password?token=...`

Endpoint:

```http
POST /api/auth/password/reset
```

Payload:

```json
{
  "token": "password_reset_token",
  "password": "NewPassword123"
}
```

Response:

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 14. Change Password

Use in:

- Settings screen
- Authenticated user password change

Endpoint:

```http
PATCH /api/auth/password/change
```

Headers:

```http
Authorization: Bearer {accessToken}
```

Payload:

```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

Response:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## UI To API Mapping

### Login Screen

File:

- `src/components/auth/login-screen.tsx`

Current behavior:

- Email is stored in Zustand
- Continue routes to `/signup`

Dynamic behavior:

1. User enters email.
2. Call `POST /api/auth/check-email`.
3. If account exists, show password login or route to password login state.
4. If account does not exist, store email and route to `/signup`.
5. Social buttons call OAuth start API.

APIs:

- `POST /api/auth/check-email`
- `POST /api/auth/login`
- `GET /api/auth/oauth/google/start`
- `GET /api/auth/oauth/github/start`
- `GET /api/auth/oauth/apple/start`

### Signup Screen

File:

- `src/components/auth/email-screen.tsx`

Current behavior:

- Email auto-fills from Zustand
- Password eye toggles show/hide
- Validation is currently disabled by comment
- Create Account routes to `/dashboard`

Dynamic behavior:

1. Email comes from store or manual input.
2. User enters password.
3. Validate email/password on frontend.
4. Get Cloudflare Turnstile token.
5. Call `POST /api/auth/signup`.
6. If verification required, route to `/verify-email`.
7. If session returned, save session and route to `/dashboard`.

APIs:

- `POST /api/auth/signup`
- `POST /api/auth/verify-human`
- `POST /api/auth/email/verification/send`

### Verify Email Screen

Recommended new file:

- `src/app/verify-email/page.tsx`
- `src/components/auth/verify-email-screen.tsx`

Flow:

1. Read `token` from URL.
2. Call `POST /api/auth/email/verification/confirm`.
3. Save session.
4. Redirect to `/dashboard`.

API:

- `POST /api/auth/email/verification/confirm`

### Session Guard

Recommended use:

- Protect `/dashboard`
- Protect `/dashboard/projects`

APIs:

- `GET /api/auth/session`
- `POST /api/auth/session/refresh`

### Account Menu Sign Out

File:

- `src/components/workspace/workspace-sidebar.tsx`

API:

- `POST /api/auth/logout`

## Validation Rules

### Email

- Required
- Must be valid email format
- Lowercase before sending to backend
- Trim whitespace

Example frontend errors:

```json
{
  "email": "Please enter a valid email address"
}
```

### Password

- Required
- Minimum 8 characters
- At least one number
- Recommended: at least one uppercase letter
- Recommended: at least one lowercase letter

Example frontend errors:

```json
{
  "password": "Password must be at least 8 characters and include a number"
}
```

### Signup

- Email must not already exist for email provider
- Password must pass rules
- Cloudflare token required

### Login

- Email required
- Password required
- Invalid credentials should use generic error:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Error Format

Use same shape for every auth API:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password is required"
  }
}
```

Common status codes:

- `200` success
- `201` account created
- `400` validation error
- `401` invalid credentials or expired session
- `403` email not verified or permission denied
- `409` email already exists
- `422` weak password or invalid token
- `429` too many attempts
- `500` server error

## Recommended Frontend Data Layer

```txt
src/services/
  api-client.ts
  auth-api.ts

src/store/
  auth-store.ts
```

Recommended `auth-store`:

```ts
type AuthStore = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  pendingEmail: string;
  setPendingEmail: (email: string) => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};
```

## Token Storage Recommendation

Best security:

- Store refresh token in httpOnly secure cookie.
- Store access token in memory or short-lived cookie.
- Avoid localStorage for sensitive tokens if possible.

If using cookie-based auth:

- Login/signup/refresh APIs set cookies from backend.
- Frontend does not need to manually store tokens.
- `GET /api/auth/session` reads cookie automatically.

## Migration Plan From Current Static Flow

1. Create `src/services/auth-api.ts`.
2. Create `src/store/auth-store.ts` or extend current `flow-store`.
3. Replace login Continue with `POST /api/auth/check-email`.
4. Add password login state for existing users.
5. Replace signup Create Account timeout with `POST /api/auth/signup`.
6. Add frontend validation back for email/password.
7. Add Cloudflare token into signup payload.
8. Add `/verify-email` route if email verification is required.
9. Add session guard for `/dashboard`.
10. Wire account menu Sign out to `POST /api/auth/logout`.
11. Wire social buttons to OAuth start endpoints.

## Priority APIs To Build First

1. `POST /api/auth/check-email`
2. `POST /api/auth/signup`
3. `POST /api/auth/login`
4. `GET /api/auth/session`
5. `POST /api/auth/session/refresh`
6. `POST /api/auth/logout`
7. `GET /api/auth/oauth/google/start`
8. `GET /api/auth/oauth/github/start`
9. `GET /api/auth/oauth/apple/start`
10. `POST /api/auth/email/verification/confirm`
