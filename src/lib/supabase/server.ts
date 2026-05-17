import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
          }
        },
      },
    }
  );
}

export async function createClientWithAuth() {
  const client = await createClient();

  const { data: { user }, error } = await client.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized: No valid session');
  }

  return { client, user };
}

export async function getUser() {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getSession() {
  const client = await createClient();
  const { data: { session }, error } = await client.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}