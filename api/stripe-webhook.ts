// Recebe os eventos do Stripe e liga/desliga o Premium do usuário no Supabase.
// Configure no Stripe: Developers → Webhooks → endpoint https://www.karaokeprime.com/api/stripe-webhook
// Eventos: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
// Variáveis no Vercel: STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY
import { createHmac, timingSafeEqual } from 'node:crypto';
import { adminClient, json } from './_lib/server.js';

const TOLERANCE_SECONDS = 300;
const ACTIVE_STATUSES = new Set(['active', 'trialing']);

/** Garante que a gravação no banco funcionou; se não, o Stripe tenta de novo */
function check(result: { error: { message: string } | null; count: number | null }, what: string) {
  if (result.error) throw new Error(`${what}: ${result.error.message}`);
  if (result.count === 0) throw new Error(`${what}: nenhum perfil encontrado`);
}

function verifySignature(payload: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const [k, ...v] = p.split('=');
      return [k.trim(), v.join('=')];
    }),
  );
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  const signatures = header
    .split(',')
    .filter((p) => p.trim().startsWith('v1='))
    .map((p) => p.trim().slice(3));

  return signatures.some((sig) => {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return json({ error: 'not configured' }, 500);

  const payload = await request.text();
  if (!verifySignature(payload, request.headers.get('stripe-signature'), secret)) {
    return json({ error: 'invalid signature' }, 400);
  }

  const event = JSON.parse(payload);
  const db = adminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        const userId = s.client_reference_id || s.metadata?.user_id;
        if (userId && s.mode === 'subscription') {
          const result = await db
            .from('profiles')
            .update(
              {
                is_prime: true,
                stripe_customer_id: s.customer,
                stripe_subscription_id: s.subscription,
                subscription_status: 'active',
              },
              { count: 'exact' },
            )
            .eq('id', userId);
          check(result, 'checkout.session.completed');
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const active = event.type !== 'customer.subscription.deleted' && ACTIVE_STATUSES.has(sub.status);
        const periodEnd = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
        const update = {
          is_prime: active,
          subscription_status: sub.status,
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        };
        const userId = sub.metadata?.user_id;
        const result = userId
          ? await db.from('profiles').update(update, { count: 'exact' }).eq('id', userId)
          : await db.from('profiles').update(update, { count: 'exact' }).eq('stripe_subscription_id', sub.id);
        check(result, event.type);
        break;
      }
      default:
        break; // eventos não usados são ignorados
    }
    return json({ received: true });
  } catch (err) {
    const keyKind = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICEROLE_KEY ?? '').slice(0, 8);
    console.error('stripe-webhook failed', event?.type, String(err), 'key prefix:', keyKind);
    return json({ error: 'processing failed' }, 500); // Stripe tenta de novo
  }
}
