import axios from 'axios';

// 🚨 SUA CHAVE ENTRA AQUI (MANTENHA AS ASPAS SIMPLES):
const YOUTUBE_API_KEY = 'COLE_AQUI_A_SUA_CHAVE_VERDADEIRA';

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
    maxResults: 15,
    type: 'video',
    videoEmbeddable: 'true',
  },
});

export const searchKaraokeVideos = async (query: string) => {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548') {
    throw new Error("A chave da API do YouTube não foi configurada corretamente.");
  }
  try {
    const response = await youtubeApi.get('/search', {
      params: { q: `${query} karaoke acoustic instrumental`, key: YOUTUBE_API_KEY },
    });
    return response.data.items;
  } catch (error) {
    console.error('Erro detalhado da API do YouTube:', error);
    throw new Error('Falha ao buscar vídeos.');
  }
};

export const searchYouTube = async (query: string) => {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548') {
    throw new Error("A chave da API do YouTube não foi configurada corretamente.");
  }
  try {
    const response = await youtubeApi.get('/search', {
      params: { q: query, key: YOUTUBE_API_KEY },
    });
    return response.data.items;
  } catch (error) {
    console.error('Erro detalhado da API do YouTube:', error);
    throw new Error('Falha ao buscar vídeos.');
  }
};