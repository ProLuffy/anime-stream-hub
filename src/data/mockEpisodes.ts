export interface Episode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  releaseDate: string;
  languages: string[];
  subtitles: string[];
}

export const mockEpisodes: Record<string, Episode[]> = {
  '1': [
    { id: '1-1', animeId: '1', number: 1, title: 'Hidden Inventory', thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2023-07-06', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
    { id: '1-2', animeId: '1', number: 2, title: 'Hidden Inventory 2', thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2023-07-13', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
    { id: '1-3', animeId: '1', number: 3, title: 'Hidden Inventory 3', thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2023-07-20', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
    { id: '1-4', animeId: '1', number: 4, title: 'Hidden Inventory 4', thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2023-07-27', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
    { id: '1-5', animeId: '1', number: 5, title: 'Premature Death', thumbnail: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2023-08-03', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
  ],
  '2': [
    { id: '2-1', animeId: '2', number: 1, title: 'I Am the Weakest', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2024-01-06', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
    { id: '2-2', animeId: '2', number: 2, title: 'If I Had One More Chance', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2024-01-13', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
    { id: '2-3', animeId: '2', number: 3, title: 'It Is Not Your Fault', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2024-01-20', languages: ['Japanese', 'English', 'Hindi'], subtitles: ['English', 'Hindi', 'Spanish'] },
  ],
  '3': [
    { id: '3-1', animeId: '3', number: 1, title: 'The Journey Begins', thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2023-09-29', languages: ['Japanese', 'English'], subtitles: ['English', 'Hindi', 'Spanish'] },
    { id: '3-2', animeId: '3', number: 2, title: 'The Mage and the Warrior', thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=170&fit=crop', duration: '24:00', releaseDate: '2023-10-06', languages: ['Japanese', 'English'], subtitles: ['English', 'Hindi', 'Spanish'] },
  ],
};

// Generate episodes for all anime
export const getEpisodesForAnime = (animeId: string, count: number = 5): Episode[] => {
  if (mockEpisodes[animeId]) {
    return mockEpisodes[animeId];
  }
  
  // Generate mock episodes
  return Array.from({ length: count }, (_, i) => ({
    id: `${animeId}-${i + 1}`,
    animeId,
    number: i + 1,
    title: `Episode ${i + 1}`,
    thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i}?w=300&h=170&fit=crop`,
    duration: '24:00',
    releaseDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    languages: ['Japanese', 'English', 'Hindi'],
    subtitles: ['English', 'Hindi', 'Spanish'],
  }));
};
