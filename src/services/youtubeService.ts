import axios from 'axios';

/**
 * Serviço para busca de vídeos no YouTube.
 * Realiza chamadas reais à API do Google.
 * Requer a variável de ambiente VITE_YOUTUBE_API_KEY configurada.
 */
export const searchYouTube = async (query: string) => {
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  if (!API_KEY) {
    console.error("[YouTube Service] Erro: VITE_YOUTUBE_API_KEY não configurada nas variáveis de ambiente.");
    return [];
  }

  console.log(`[YouTube Service] Realizando busca real por: "${query}"`);

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoEmbeddable: 'true', // Filtra apenas vídeos que permitem reprodução em sites externos
        videoSyndicated: 'true',  // Garante que o vídeo possa ser reproduzido fora do youtube.com
        maxResults: 15,
        key: API_KEY
      }
    });

    // Retorna os itens reais da API
    return response.data.items || [];
  } catch (error: any) {
    console.error("Erro na busca do YouTube API:", error.response?.data || error.message);
    // Lança o erro para que a UI possa tratar (ex: mostrar toast de erro de cota ou chave inválida)
    throw error;
  }
};