export { createClient } from './client';
export { getClient } from './client';
export { createClient as createServerClient } from './server';
export { createClientWithAuth, getUser, getSession } from './server';
export { signInWithGoogle, signOut, getCurrentUser, requireAuth } from './auth';
export { middleware, config as middlewareConfig } from './middleware';
export type { Database } from './database.types';