// Cria a sessão de pagamento do Stripe para o usuário logado.
// POST /api/stripe-checkout  { plan: 'monthly' | 'annual' }  + header Authorization: Bearer <token Supabase>
// Variáveis no Vercel: STRIPE_SECRET_KEY, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_ANNUAL, SUPABASE_SERVICE_ROLE_KEY
import { json, stripe, userFromRequest } from './_lib/server.js';

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await userFromRequest(request);
    if (!user) return json({ error: 'Faça login para assinar.' }, 401);

    const body = await request.json().catch(() => ({}));
    const plan = body?.plan === 'annual' ? 'annual' : 'monthly';
    const price = plan === 'annual' ? process.env.STRIPE_PRICE_ANNUAL : process.env.STRIPE_PRICE_MONTHLY;
    if (!price) return json({ error: 'Plano indisponível no momento.' }, 500);

    const origin = new URL(request.url).origin;
    const session = await stripe('checkout/sessions', {
      mode: 'subscription',
      'line_items[0][price]': price,
      'line_items[0][quantity]': '1',
      client_reference_id: user.id,
      customer_email: user.email ?? '',
      'metadata[user_id]': user.id,
      'subscription_data[metadata][user_id]': user.id,
      allow_promotion_codes: 'true',
      success_url: `${origin}/academy?assinatura=sucesso`,
      cancel_url: `${origin}/premium?assinatura=cancelada`,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('stripe-checkout failed', err);
    return json({ error: 'Não foi possível iniciar o pagamento.' }, 500);
  }
}
