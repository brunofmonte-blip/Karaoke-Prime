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

    // Retorna os itens reais da API ou um array vazio se não houver dados
    return response.data.items || [];
  } catch (error: any) {
    // Log detalhado para depuração conforme solicitado
    console.error("YOUTUBE API ERROR:", error.response?.data || error.message);
    
    // Retorna array vazio para evitar que a UI quebre, mas o erro estará no console
    return [];
  }
};