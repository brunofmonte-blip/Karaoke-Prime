/**
 * Serviço para busca de vídeos no YouTube.
 * Realiza chamadas reais à API do Google com fallback de segurança.
 */
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYouTube = async (query: string) => {
  if (!query || query.trim() === '') return [];
  
  // Adiciona termos específicos para forçar vídeos de karaokê
  const karaokeQuery = query + " karaoke instrumental";
  
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(karaokeQuery)}&type=video&videoEmbeddable=true&key=${API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("YouTube API Error:", data.error.message);
      throw new Error("API falhou");
    }
    return data.items || [];
  } catch (error) {
    console.error("Fallback ativado devido a erro na API:", error);
    // FALLBACK: Vídeos REAIS de Karaokê para testes
    // Adicionamos a propriedade 'high' para evitar erros de renderização na UI
    return [
      { 
        id: { videoId: 'e2k2tYpM3Dk' }, 
        snippet: { 
          title: 'Tim Maia - Descobridor dos Sete Mares (Karaokê)', 
          channelTitle: 'Karaokê Prime', 
          thumbnails: { 
            default: { url: 'https://img.youtube.com/vi/e2k2tYpM3Dk/default.jpg' },
            high: { url: 'https://img.youtube.com/vi/e2k2tYpM3Dk/hqdefault.jpg' }
          } 
        } 
      },
      { 
        id: { videoId: '5bJ42uH-cGE' }, 
        snippet: { 
          title: 'Kid Abelha - Como Eu Quero (Karaokê)', 
          channelTitle: 'Karaokê Prime', 
          thumbnails: { 
            default: { url: 'https://img.youtube.com/vi/5bJ42uH-cGE/default.jpg' },
            high: { url: 'https://img.youtube.com/vi/5bJ42uH-cGE/hqdefault.jpg' }
          } 
        } 
      },
      { 
        id: { videoId: 'j1rG-e21-0g' }, 
        snippet: { 
          title: 'Evidências - Chitãozinho & Xororó (Karaokê)', 
          channelTitle: 'Karaokê Prime', 
          thumbnails: { 
            default: { url: 'https://img.youtube.com/vi/j1rG-e21-0g/default.jpg' },
            high: { url: 'https://img.youtube.com/vi/j1rG-e21-0g/hqdefault.jpg' }
          } 
        } 
      }
    ];
  }
};