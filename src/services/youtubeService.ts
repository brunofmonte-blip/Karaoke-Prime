import axios from 'axios';

/**
 * Serviço para busca de vídeos no YouTube.
 * Filtra estritamente por vídeos que permitem incorporação (embed).
 */
export const searchYouTube = async (query: string) => {
  // Substitua pela sua chave de API do Google Cloud Console
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "";
  
  console.log(`[YouTube Service] Buscando por: ${query} (Embeddable Only)`);

  if (!API_KEY) {
    console.warn("YouTube API Key não encontrada. Usando dados simulados para demonstração.");
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: { videoId: "oVbXpK_BRbw" },
        snippet: {
          title: `${query} - Karaoke Version (Simulado)`,
          channelTitle: "Karaoke Prime Studio",
          thumbnails: { high: { url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500" } }
        }
      },
      {
        id: { videoId: "dQw4w9WgXcQ" },
        snippet: {
          title: `Popular Hit: ${query} (Simulado)`,
          channelTitle: "Global Karaoke Hits",
          thumbnails: { high: { url: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=500" } }
        }
      }
    ];
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoEmbeddable: 'true', // CORREÇÃO CRÍTICA: Filtra apenas vídeos que permitem embed
        maxResults: 15,
        key: API_KEY
      }
    });

    return response.data.items;
  } catch (error) {
    console.error("Erro na busca do YouTube API:", error);
    return [];
  }
};