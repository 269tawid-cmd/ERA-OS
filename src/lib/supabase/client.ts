import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );

  return browserClient;
}

export function getClient() {
  if (!browserClient) {
    return createClient();
  }
  return browserClient;
}

export type GenericTableClient = {
  select: (columns?: string) => {
    eq: (column: string, value: unknown) => GenericQueryBuilder;
    order: (column: string, options?: { ascending?: boolean }) => GenericQueryBuilder;
    insert: (data: Record<string, unknown>) => GenericQueryBuilder;
    update: (data: Record<string, unknown>) => GenericQueryBuilder;
    delete: () => GenericQueryBuilder;
  };
};

export type GenericQueryBuilder = {
  eq: (column: string, value: unknown) => GenericQueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => GenericQueryBuilder;
  select: (columns?: string) => GenericQueryBuilder;
  limit: (n: number) => GenericQueryBuilder;
  single: () => Promise<{ data: unknown; error: unknown }>;
  then: (onfulfilled?: (value: { data: unknown; error: unknown }) => unknown, onrejected?: unknown) => unknown;
};

export function getTable(tableName: string): GenericTableClient {
  const client = getClient();
  return (client as unknown as { from: (name: string) => GenericTableClient }).from(tableName);
}