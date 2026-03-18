import axios from 'axios';

// 🚨 COLE SUA CHAVE EXATAMENTE AQUI, MANTENDO AS ASPAS SIMPLES:
const YOUTUBE_API_KEY = 'COLE_SUA_CHAVE_AQUI_DENTRO';

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    part: 'snippet',
    maxResults: 15,
    type: 'video',
    videoEmbeddable: 'true',
  },
});

// Função 1: Usada para buscar os Karaokês
export const searchKaraokeVideos = async (query: string) => {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'COLE_SUA_CHAVE_AQUI_DENTRO') {
    throw new Error("A chave da API do YouTube não foi configurada corretamente.");
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
    throw new Error('Falha ao buscar vídeos.');
  }
};

// 🚨 A CORREÇÃO: Função 2 devolvida para o SongPlayer não quebrar!
export const searchYouTube = async (query: string) => {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'COLE_SUA_CHAVE_AQUI_DENTRO') {
    throw new Error("A chave da API do YouTube não foi configurada corretamente.");
  }

  try {
    const response = await youtubeApi.get('/search', {
      params: {
        q: query,
        key: YOUTUBE_API_KEY,
      },
    });
    
    return response.data.items;
  } catch (error) {
    console.error('Erro detalhado da API do YouTube:', error);
    throw new Error('Falha ao buscar vídeos.');
  }
};