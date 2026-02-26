/**
 * Serviço centralizado para interações com a API do YouTube.
 * Chave de API fixada conforme solicitação para estabilidade imediata.
 */

const API_KEY = "AIzaSyAoMCAB5-K0Tj0tHaWEskLXN7hjfspux8M";

export const searchYoutubeVideos = async (query: string, maxResults: number = 8) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${API_KEY}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "YouTube API Error");
  }

  return await response.json();
};