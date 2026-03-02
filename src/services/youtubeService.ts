// Substitua 'SUA_CHAVE_AQUI' pela chave real gerada no Google Cloud
const API_KEY = 'SUA_CHAVE_AQUI'; 

export const searchYouTube = async (query: string) => {
  if (!query || query.trim() === '') return [];

  // Forçando o algoritmo do YouTube a buscar apenas karaokês e em canais específicos
  // Exemplo de canais focados em Karaokê no Brasil e no Mundo
  const channelFilters = "(karaoke OR instrumental OR 'Ponto do Karaokê' OR 'Murillo Shooow' OR 'Karaokê Brasil' OR 'Sing King')";
  const finalQuery = `${query} ${channelFilters}`;

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(finalQuery)}&type=video&videoEmbeddable=true&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    
    // Se o Google bloquear a requisição (ex: API não ativada no painel), mostre o erro real
    if (!response.ok || data.error) {
      console.error("🔴 ERRO FATAL NA API DO YOUTUBE:", data.error?.message || response.statusText);
      return [];
    }

    return data.items || [];
  } catch (error) {
    console.error("🔴 ERRO DE CONEXÃO COM O YOUTUBE:", error);
    return [];
  }
};