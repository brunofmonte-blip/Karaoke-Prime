/**
 * Serviço para busca de vídeos no YouTube.
 * Realiza chamadas reais à API do Google.
 */
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYouTube = async (query: string) => {
  // Previne buscas vazias que causam o erro "Nenhuma música encontrada"
  if (!query || query.trim() === '') return [];
  
  try {
    // Use a constante da API_KEY que já existe no seu arquivo aqui
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("YouTube API Error:", data.error.message);
      return [];
    }
    
    return data.items || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};