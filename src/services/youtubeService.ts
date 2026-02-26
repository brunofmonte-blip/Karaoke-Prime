/**
 * Serviço centralizado para interações com a API do YouTube.
 * Configuração direta com chave fixa para estabilidade total em produção.
 */

const API_KEY = 'AIzaSyAoMCAB5-K0Tj0tHaWEskLXN7hjfspux8M';
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export const searchYoutubeVideos = async (query: string, maxResults: number = 12) => {
  const url = `${BASE_URL}?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("YouTube API Error Details:", errorData);
    throw new Error(errorData.error?.message || "YouTube API Error");
  }

  return await response.json();
};