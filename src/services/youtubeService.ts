import axios from 'axios';

// 🚨 COLE SUA CHAVE EXATAMENTE AQUI, MANTENDO AS ASPAS SIMPLES:
const YOUTUBE_API_KEY = 'AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548';

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
  // Verifica se a chave está vazia ou ainda com o texto de exemplo
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'COLE_SUA_CHAVE_AQUI_DENTRO') {
    throw new Error("A chave da API do YouTube não foi configurada corretamente no arquivo youtubeService.tsx");
  }

  try {
    const response = await youtubeApi.get('/search', {
      params: {
        q: `${query} karaoke acoustic instrumental`,
        key: YOUTUBE_API_KEY,
      },
    });
    
    return response.data.items;
  } catch (error) {
    console.error('Erro detalhado da API do YouTube:', error);
    throw new Error('Falha ao buscar vídeos. Verifique se a sua chave da API é válida e se tem cota disponível.');
  }
};