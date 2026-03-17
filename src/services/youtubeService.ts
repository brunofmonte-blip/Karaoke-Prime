// 📦 SERVIÇO DE CONEXÃO COM A API DO YOUTUBE
// Este arquivo deve conter apenas lógica pura (TypeScript), sem elementos React/JSX.

const API_KEY = 'AIzaSyBaCJPLU9kL_Ufu4S2yJX2v5up6vp5R548'; 

/**
 * Realiza a busca de vídeos de karaokê no YouTube.
 * @param query Termo de busca (artista ou música)
 */
export const searchYouTube = async (query: string) => {
  if (!query || query.trim() === '') return [];

  // Filtros para priorizar canais de karaokê e conteúdo instrumental
  const channelFilters = "(karaoke OR instrumental OR 'Ponto do Karaokê' OR 'Murillo Shooow' OR 'Karaokê Brasil' OR 'Sing King')";
  const finalQuery = `${query} ${channelFilters}`;

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(finalQuery)}&type=video&videoEmbeddable=true&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok || data.error) {
      console.error("🔴 ERRO NA API DO YOUTUBE:", data.error?.message || response.statusText);
      return [];
    }

    return data.items || [];
  } catch (error) {
    console.error("🔴 ERRO DE CONEXÃO COM O YOUTUBE:", error);
    return [];
  }
};