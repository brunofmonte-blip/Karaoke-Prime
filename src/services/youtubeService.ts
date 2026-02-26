// Motor de Busca YouTube - Configuração de Produção Oficial
const API_KEY = 'AIzaSyAoMCAB5-K0Tj0tHaWEskLXN7hjfspux8M';

export const searchYouTube = async (query: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(
        query
      )}&type=video&videoEmbeddable=true&key=${API_KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      throw new Error('Erro na API do YouTube');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Search failed:', error);
    return []; // Retorna lista vazia em vez de quebrar o app
  }
};