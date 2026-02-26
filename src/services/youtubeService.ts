const API_KEY = 'AIzaSyAoMCAB5-K0Tj0tHaWEskLXN7hjfspux8M';

export const searchYouTube = async (query: string) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&key=${API_KEY}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube');
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('YouTube Search Error:', error);
    return [];
  }
};