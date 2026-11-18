// Função serverless (Vercel) — a chave do YouTube fica só no servidor.
// Configure no Vercel: Settings → Environment Variables → YOUTUBE_API_KEY
// Uso no app: GET /api/youtube-search?q=evidencias&mode=karaoke

const MAX_QUERY_LENGTH = 100;
const KARAOKE_SUFFIX = 'karaoke acoustic instrumental';

export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return json({ error: 'Server is not configured' }, 500);
  }

  const url = new URL(request.url);
  const rawQuery = (url.searchParams.get('q') ?? '').trim();
  const mode = url.searchParams.get('mode') === 'karaoke' ? 'karaoke' : 'general';

  if (!rawQuery) return json({ items: [] }, 200);
  if (rawQuery.length > MAX_QUERY_LENGTH) {
    return json({ error: 'Query too long' }, 400);
  }

  const query = mode === 'karaoke' ? `${rawQuery} ${KARAOKE_SUFFIX}` : rawQuery;

  const params = new URLSearchParams({
    part: 'snippet',
    maxResults: '15',
    type: 'video',
    videoEmbeddable: 'true',
    safeSearch: 'strict',
    q: query,
    key: apiKey,
  });

  try {
    const upstream = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
    const data = await upstream.json();

    if (!upstream.ok || data.error) {
      // Nunca devolve a mensagem crua do Google (pode conter detalhes da chave/projeto)
      console.error('YouTube API error', upstream.status, data?.error?.message);
      return json({ error: 'Search unavailable' }, 502);
    }

    // Cache na borda: mesma busca não gasta cota de novo por 1 hora
    return json({ items: data.items ?? [] }, 200, 'public, s-maxage=3600, stale-while-revalidate=86400');
  } catch (err) {
    console.error('YouTube fetch failed', err);
    return json({ error: 'Search unavailable' }, 502);
  }
}

function json(body: unknown, status: number, cacheControl = 'no-store'): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cacheControl },
  });
}
