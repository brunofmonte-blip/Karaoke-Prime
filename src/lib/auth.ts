/**
 * Camada de autenticação do Karaoke Prime — 100% Supabase Auth.
 *
 * Mantém a mesma "forma" das funções do Firebase que o app usava
 * (onAuthStateChanged, signOut, signInWithPopup...), para que as telas
 * troquem só o import. O objeto `auth` é apenas um marcador.
 */
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const auth = { provider: 'supabase' as const };
export class GoogleAuthProvider {}
export const googleProvider = new GoogleAuthProvider();

export function toAppUser(u: SupabaseUser | null | undefined): User | null {
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, string | undefined>;
  return {
    uid: u.id,
    id: u.id,
    email: u.email ?? null,
    displayName: meta.full_name || meta.name || (u.email ? u.email.split('@')[0] : null),
    photoURL: meta.avatar_url || meta.picture || null,
  };
}

class AuthError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function mapError(message: string): AuthError {
  const m = message.toLowerCase();
  if (m.includes('already registered')) return new AuthError('auth/email-already-in-use', message);
  if (m.includes('password should be') || m.includes('weak')) return new AuthError('auth/weak-password', message);
  if (m.includes('invalid login credentials')) return new AuthError('auth/invalid-credential', message);
  if (m.includes('email not confirmed')) return new AuthError('auth/email-not-confirmed', 'Confirme seu e-mail antes de entrar.');
  return new AuthError('auth/unknown', message);
}

export function onAuthStateChanged(_auth: unknown, callback: (user: User | null) => void): () => void {
  supabase.auth.getSession().then(({ data }) => callback(toAppUser(data.session?.user)));
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toAppUser(session?.user));
  });
  return () => data.subscription.unsubscribe();
}

export async function signOut(_auth?: unknown): Promise<void> {
  await supabase.auth.signOut();
}

/** Login com Google. No Supabase é um redirecionamento (não popup): a página volta logada. */
export async function signInWithPopup(_auth?: unknown, _provider?: unknown): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/basic` },
  });
  if (error) throw mapError(error.message);
}

export async function signInWithEmailAndPassword(_auth: unknown, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw mapError(error.message);
  return { user: toAppUser(data.user) };
}

export async function createUserWithEmailAndPassword(
  _auth: unknown,
  email: string,
  password: string,
  displayName?: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: displayName ? { full_name: displayName } : undefined,
      emailRedirectTo: `${window.location.origin}/basic`,
    },
  });
  if (error) throw mapError(error.message);
  return { user: toAppUser(data.user), needsConfirmation: !data.session };
}

export async function updateProfile(_user: unknown, profile: { displayName?: string }) {
  const { data } = await supabase.auth.getSession();
  if (!data.session || !profile.displayName) return; // sem sessão (aguardando confirmação): nome já foi no cadastro
  await supabase.auth.updateUser({ data: { full_name: profile.displayName } });
}

/** Token da sessão atual, para chamar as funções /api protegidas */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
