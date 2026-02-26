/**
 * Serviço centralizado para interações com a API do YouTube.
 * Utiliza a variável de ambiente VITE_YOUTUBE_API_KEY configurada no Vercel.
 */

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Log de erro claro para auxiliar no debug de produção/build
if (!API_KEY) {
  console.error(
    "CRITICAL ERROR: VITE_YOUTUBE_API_KEY is missing! " +
    "YouTube features will not work. Please ensure the environment variable is set in Vercel."
  );
}

export const getYoutubeApiKey = () => {
  if (!API_KEY) {
    console.warn("Attempting to use YouTube API without a valid key.");
  }
  return API_KEY || "";
};

export const searchYoutubeVideos = async (query: string, maxResults: number = 8) => {
  const key = getYoutubeApiKey();
  if (!key) throw new Error("API_KEY_MISSING");

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${key}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "YouTube API Error");
  }

  return await response.json();
};