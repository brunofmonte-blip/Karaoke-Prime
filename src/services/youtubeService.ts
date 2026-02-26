/**
 * Motor de Busca YouTube - Configuração de Produção
 * Bypass total de variáveis de ambiente para estabilidade imediata.
 */

const API_KEY = 'AIzaSyAoMCAB5-K0Tj0tHaWEskLXN7hjfspux8M';

export const searchYouTube = async (query: string) => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${API_KEY}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error("YouTube API Error:", errorData);
    throw new Error(errorData.error?.message || "YouTube API Error");
  }

  const data = await response.json();
  return data.items; 
};