import axios from 'axios';

// 🚨 COLE SUA CHAVE UMA ÚNICA VEZ AQUI (MANTENHA AS ASPAS SIMPLES):
const YOUTUBE_API_KEY = 'AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548';

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
});

export const searchKaraokeVideos = async (query: string) => {
  try {
    const response = await youtubeApi.get('/search', {
      params: {
        part: 'snippet',
        maxResults: 15,
        type: 'video',
        videoEmbeddable: 'true',
        q: `${query} karaoke acoustic instrumental`,
        key: YOUTUBE_API_KEY, // ⚙️ O motor puxa a chave daqui automaticamente
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Erro detalhado da API do YouTube:', error);
    throw new Error('Falha ao buscar vídeos. Verifique se a sua chave da API é válida e tem cota disponível.');
  }
};

export const searchYouTube = async (query: string) => {
  try {
    const response = await youtubeApi.get('/search', {
      params: {
        part: 'snippet',
        maxResults: 15,
        type: 'video',
        videoEmbeddable: 'true',
        q: query,
        key: YOUTUBE_API_KEY, // ⚙️ O motor puxa a chave daqui automaticamente
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Erro detalhado da API do YouTube:', error);
    throw new Error('Falha ao buscar vídeos. Verifique se a sua chave da API é válida e tem cota disponível.');
  }
};