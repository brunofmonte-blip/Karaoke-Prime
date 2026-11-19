// Cria a sessão de pagamento do Stripe para o usuário logado.
// POST /api/stripe-checkout  { plan: 'monthly' | 'annual', currency: 'brl' | 'usd' }  + header Authorization: Bearer <token Supabase>
// Variáveis no Vercel: STRIPE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY e os preços:
//   STRIPE_PRICE_MONTHLY / STRIPE_PRICE_ANNUAL (R$) e STRIPE_PRICE_MONTHLY_USD / STRIPE_PRICE_ANNUAL_USD (US$)
import { adminClient, json, stripe, userFromRequest } from './_lib/server.js';

// Teste grátis do plano anual (só para quem nunca assinou)
const ANNUAL_TRIAL_DAYS = '7';

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await userFromRequest(request);
    if (!user) return json({ error: 'Faça login para assinar.' }, 401);

    const body = await request.json().catch(() => ({}));
    const plan = body?.plan === 'annual' ? 'annual' : 'monthly';
    const currency = body?.currency === 'usd' ? 'usd' : 'brl';
    const env = process.env;
    const price =
      currency === 'usd'
        ? plan === 'annual' ? env.STRIPE_PRICE_ANNUAL_USD : env.STRIPE_PRICE_MONTHLY_USD
        : plan === 'annual' ? env.STRIPE_PRICE_ANNUAL : env.STRIPE_PRICE_MONTHLY;
    if (!price) return json({ error: 'Plano indisponível no momento.' }, 500);

    // Teste grátis só no anual e só na primeira assinatura (evita repetir o teste)
    let trial: Record<string, string> = {};
    if (plan === 'annual') {
      const { data: profile } = await adminClient()
        .from('profiles')
        .select('stripe_subscription_id')
        .eq('id', user.id)
        .maybeSingle();
      if (!profile?.stripe_subscription_id) trial = { 'subscription_data[trial_period_days]': ANNUAL_TRIAL_DAYS };
    }

    const origin = new URL(request.url).origin;
    const session = await stripe('checkout/sessions', {
      ...trial,
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
