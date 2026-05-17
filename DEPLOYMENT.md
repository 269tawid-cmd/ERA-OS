# Era OS - Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- [ ] Supabase project created
- [ ] Google OAuth credentials (for authentication)
- [ ] Gemini API key (optional - AI works without it via deterministic fallback)
- [ ] Vercel account

---

## Part 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Note your project URL and anon key

### 1.2 Run Database Migration
1. Open Supabase SQL Editor
2. Copy contents from `supabase/migrations/001_initial_schema.sql`
3. Run the migration

This creates:
- 4 tables: tasks, user_progress, logs, ctf_entries
- RLS policies for all tables
- Auto-trigger for user progress creation

### 1.3 Configure Authentication
1. Go to Authentication > Providers > Google
2. Enable Google OAuth
3. Add your authorized domains
4. Go to Authentication > URL Configuration
5. Add redirect URLs:
   - `https://your-project.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

---

## Part 2: Environment Variables

### Required Variables

Create `.env.local` in project root:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SITE_URL=https://your-project.vercel.app

# Gemini (Optional - AI works without via fallback)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
```

### Important Security Notes

- **NEVER** prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`
- **NEVER** prefix `GEMINI_API_KEY` with `NEXT_PUBLIC_`
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be public

---

## Part 3: Vercel Deployment

### 3.1 Deploy
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel
```

Or connect GitHub repository in Vercel dashboard.

### 3.2 Configure Environment Variables
In Vercel dashboard > Settings > Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SITE_URL=https://your-project.vercel.app
GEMINI_API_KEY=your-gemini-api-key
```

### 3.3 Build Command
```
npm run build
```

---

## Part 4: Verify Deployment

### 4.1 Test Authentication
1. Visit deployed URL
2. Should redirect to /auth/login
3. Test Google OAuth sign-in

### 4.2 Test Dashboard
1. After signing in, should see dashboard
2. Check:
   - Month card displays correctly
   - Task creation works
   - AI mentor panel loads

### 4.3 Test AI Mentor (if Gemini key configured)
1. Click "Today's Tasks" button
2. Should receive AI-generated task recommendations
3. Response should include roadmap context

### 4.4 Test Fallback (without Gemini key)
1. Remove GEMINI_API_KEY from env
2. Reload page
3. Click "Today's Tasks"
4. Should see "Quick Response" badge - deterministic fallback working

---

## Part 5: Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migration applied
- [ ] Google OAuth configured and working
- [ ] RLS policies active (test: query other user's data - should fail)
- [ ] No secrets in client bundle (verify in Network tab)
- [ ] Build passes: `npm run build`
- [ ] TypeScript passes: `npx tsc --noEmit`
- [ ] Lint passes: `npm run lint`

---

## Troubleshooting

### Build Fails
- Check all required env vars are set
- Run `npm run build` locally first

### Auth Redirect Loop
- Check SITE_URL matches exactly in Supabase and env
- Check redirect URLs in Supabase Auth settings

### RLS Issues
- Verify tables have RLS enabled
- Check policy syntax in migration

### AI Not Working
- Check GEMINI_API_KEY is set
- Check API key has quota remaining
- Fallback should work without key

---

## Future Scaling Considerations

### When Ready For:
- **Analytics**: Add Vercel Analytics or simple page view tracking
- **Monitoring**: Add Sentry for error tracking
- **CI/CD**: Add GitHub Actions for automatic deployments
- **Database**: Supabase handles scaling automatically on Pro plan

### Architecture Notes
- Era OS is designed for single-user (Tawhid)
- No multi-tenant complexity
- AI fallback ensures always-working experience
- Roadmap-first approach keeps focus narrow