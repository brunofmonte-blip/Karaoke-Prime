import axios from 'axios';

// A busca passa pela função /api/youtube-search (Vercel).
// A chave do YouTube NÃO fica mais no código do navegador.
const searchApi = axios.create({ baseURL: '/api' });

const search = async (q: string, mode: 'karaoke' | 'general') => {
  if (!q || q.trim() === '') return [];
  try {
    const response = await searchApi.get('/youtube-search', { params: { q, mode } });
    return response.data.items ?? [];
  } catch (error) {
    console.error('Erro na busca de vídeos:', error);
    throw new Error('Falha ao buscar vídeos. Tente novamente em instantes.');
  }
};

export const searchKaraokeVideos = (query: string) => search(query, 'karaoke');

export const searchYouTube = (query: string) => search(query, 'general');
