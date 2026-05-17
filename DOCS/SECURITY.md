# Era OS — Security Architecture

## Overview

Era OS implements defense-in-depth security with multiple layers protecting user data.

---

## 1. Row Level Security (RLS)

### What is RLS?

Row Level Security is a database-level access control that ensures users can only access their own data, regardless of how they connect to the database.

### Implementation

Every table has RLS enabled with policies that check `auth.uid() = user_id`:

```sql
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);
```

### Why This Matters

- **Defense in depth**: Even if an API key is compromised, RLS prevents cross-user data access
- **Query-level enforcement**: Every SELECT, INSERT, UPDATE, DELETE is filtered
- **No trust required**: Database enforces isolation at the lowest level

### Tables Protected

| Table | RLS Policies |
|-------|--------------|
| tasks | 4 policies (SELECT, INSERT, UPDATE, DELETE) |
| user_progress | 3 policies (SELECT, INSERT, UPDATE) |
| logs | 4 policies (SELECT, INSERT, UPDATE, DELETE) |
| ctf_entries | 4 policies (SELECT, INSERT, UPDATE, DELETE) |

---

## 2. Auth Validation

### Server-Side Validation

We **never trust client-side auth state** alone. Every protected operation validates on the server:

```typescript
// server.ts - validates session server-side
export async function createClientWithAuth() {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized: No valid session');
  }

  return { client, user };
}
```

### Middleware Validation

The middleware intercepts every request and validates the session before allowing access:

```typescript
// middleware.ts
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  return NextResponse.redirect('/auth/login');
}
```

### Why This Matters

- **Prevents token theft**: Stolen JWTs can't be used without server validation
- **Session revocation**: User logout immediately invalidates access
- **No bypass possible**: Can't skip auth by modifying client state

---

## 3. SSR Session Handling

### Cookie-Based Sessions

@supabase/ssr manages sessions via HTTP-only cookies:

```typescript
// server.ts - uses HTTP-only cookies
createServerClient<Database>(url, anonKey, {
  cookies: {
    getAll() { return request.cookies.getAll(); },
    setAll(cookiesToSet) { /* sets HTTP-only */ }
  }
})
```

### Security Properties

- **HttpOnly**: JavaScript cannot read the session cookie
- **Secure**: Only sent over HTTPS
- **SameSite**: Prevents CSRF attacks
- **Signed**: Tamper-evident via server-side validation

### Server Component Usage

All Server Components use `createClient()` which validates the session cookie automatically:

```typescript
// Every Server Component request validates the session
const supabase = await createClient();
const { data } = await supabase.from('tasks').select('*');
```

---

## 4. Environment Protection

### Never Exposed to Client

The service role key is **never exposed** to the browser:

```typescript
// client.ts - uses ANON key only
createBrowserClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
```

### Environment Validation

All environment variables are validated at runtime using Zod:

```typescript
// env.ts - validates all required vars
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // ...
});
```

---

## 5. Google OAuth Security

### OAuth Flow

1. User clicks "Sign in with Google"
2. Redirect to Google OAuth
3. Google redirects to `/auth/callback` with auth code
4. Server exchanges code for session
5. Session cookie set via HTTP-only cookie

### Security Measures

- **PKCE**: Not required for server-side exchange (but recommended)
- **State parameter**: Prevents CSRF (built into @supabase/ssr)
- **Redirect validation**: Only allowed URLs in Supabase Dashboard

---

## 6. Protected Routes

### Middleware Strategy

```typescript
// middleware.ts - routes requiring auth
const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/callback'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/_next');
}
```

### Flow

1. Request hits middleware
2. If public route → allow
3. If protected → validate session
4. If no session → redirect to login
5. If valid session → allow

---

## 7. Audit Trail

### Automatic User Creation

A database trigger automatically creates user progress when a new user signs up:

```sql
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

This ensures every authenticated user has a progress record.

---

## 8. Attack Vectors Mitigated

| Attack Vector | Protection |
|--------------|------------|
| SQL Injection | Parameterized queries via Supabase client |
| XSS | React auto-escapes, no dangerous innerHTML |
| CSRF | SameSite cookies, RLS at DB level |
| Session Hijacking | HttpOnly cookies, server validation |
| Data Leakage | RLS policies on every table |
| Privilege Escalation | Server-side auth validation only |

---

## Summary

Era OS security is built on:

1. **RLS**: Database-level isolation
2. **Server validation**: Never trust client state
3. **HttpOnly cookies**: Secure session handling
4. **Environment separation**: Service role never exposed
5. **Middleware protection**: Universal auth enforcement

The roadmap-first design means security protects user progression data — their XP, streaks, and learning journey.