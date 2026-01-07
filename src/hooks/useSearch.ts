import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { AnimeCardProps } from '@/components/anime/AnimeCard';
import { trendingAnime, latestReleases, popularDonghua } from '@/data/mockAnime';

// Combine all anime for searching
const allAnime = [...trendingAnime, ...latestReleases, ...popularDonghua];

// Configure Fuse.js for fuzzy search with typo tolerance
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'genres', weight: 0.2 },
    { name: 'type', weight: 0.1 },
  ],
  threshold: 0.4, // Lower = stricter, Higher = more fuzzy
  distance: 100,
  includeScore: true,
  minMatchCharLength: 2,
};

export interface SearchFilters {
  type: 'all' | 'anime' | 'donghua';
  genre: string;
  language: string;
  status: 'all' | 'ongoing' | 'completed';
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    genre: '',
    language: '',
    status: 'all',
  });
  const [watchHistory, setWatchHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anicrew-watch-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const fuse = useMemo(() => new Fuse(allAnime, fuseOptions), []);

  // Fuzzy search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    let results = fuse.search(query).map(result => result.item);
    
    // Apply filters
    if (filters.type !== 'all') {
      results = results.filter(item => item.type === filters.type);
    }
    if (filters.genre) {
      results = results.filter(item => 
        item.genres.some(g => g.toLowerCase().includes(filters.genre.toLowerCase()))
      );
    }
    if (filters.status !== 'all') {
      results = results.filter(item => item.status === filters.status);
    }
    
    return results;
  }, [query, filters, fuse]);

  // AI-powered recommendations based on watch history
  const recommendations = useMemo(() => {
    if (watchHistory.length === 0) {
      // Return popular items if no history
      return allAnime.slice(0, 6);
    }

    const watchedItems = allAnime.filter(item => watchHistory.includes(item.id));
    
    // Collect genres from watched items
    const watchedGenres = watchedItems.flatMap(item => item.genres);
    const genreCount: Record<string, number> = {};
    watchedGenres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });

    // Sort genres by frequency
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    // Find items with matching genres that haven't been watched
    const recommended = allAnime
      .filter(item => !watchHistory.includes(item.id))
      .map(item => {
        const matchingGenres = item.genres.filter(g => topGenres.includes(g));
        return { item, score: matchingGenres.length };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ item }) => item);

    return recommended.length > 0 ? recommended : allAnime.slice(0, 6);
  }, [watchHistory]);

  const addToWatchHistory = useCallback((animeId: string) => {
    setWatchHistory(prev => {
      const updated = prev.includes(animeId) ? prev : [...prev, animeId];
      localStorage.setItem('anicrew-watch-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearWatchHistory = useCallback(() => {
    setWatchHistory([]);
    localStorage.removeItem('anicrew-watch-history');
  }, []);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    searchResults,
    recommendations,
    addToWatchHistory,
    clearWatchHistory,
    watchHistory,
    allAnime,
  };
};
