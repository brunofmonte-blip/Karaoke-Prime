/**
 * Serviço para busca de vídeos no YouTube.
 * Nota: Em um ambiente de produção, você usaria a API oficial do YouTube com uma chave de API.
 * Para este exemplo, estamos simulando a busca.
 */

export const searchYouTube = async (query: string) => {
  console.log(`[YouTube Service] Buscando por: ${query}`);
  
  // Simulando um delay de rede
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock de resultados para demonstração
  // Em uma implementação real, faríamos um fetch para a API do YouTube
  return [
    {
      id: { videoId: "oVbXpK_BRbw" },
      snippet: {
        title: `${query} - Karaoke Version`,
        channelTitle: "Karaoke Prime Studio",
        thumbnails: {
          high: { url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500" }
        }
      }
    },
    {
      id: { videoId: "dQw4w9WgXcQ" },
      snippet: {
        title: `Popular Hit: ${query}`,
        channelTitle: "Global Karaoke Hits",
        thumbnails: {
          high: { url: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=500" }
        }
      }
    },
    {
      id: { videoId: "L_jWHffIx5E" },
      snippet: {
        title: `${query} (Acoustic Instrumental)`,
        channelTitle: "Acoustic Sessions",
        thumbnails: {
          high: { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500" }
        }
      }
    }
  ];
};