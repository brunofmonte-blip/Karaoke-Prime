-- Karaoke Prime — assinatura protegida (18/11/2026)
-- 1) Colunas da assinatura Stripe
alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists current_period_end timestamptz;
alter table public.profiles alter column is_prime set default false;
create index if not exists profiles_stripe_subscription_idx on public.profiles (stripe_subscription_id);

-- 2) O navegador NÃO pode alterar is_prime nem dados do Stripe (só o servidor, com a service role)
revoke insert, update on public.profiles from anon, authenticated;
grant insert (id, username, avatar_url) on public.profiles to authenticated;
grant update (username, avatar_url, academy_level, best_note, xp, badges, updated_at) on public.profiles to authenticated;

-- 3) Dados do Stripe também não podem ser lidos pelo navegador
revoke select on public.profiles from anon, authenticated;
grant select (id, username, avatar_url, academy_level, best_note, ranking_position, updated_at, is_prime, xp, badges)
  on public.profiles to anon, authenticated;
