import { useState, useCallback, useEffect } from 'react';

export interface WatchlistItem {
  animeId: string;
  addedAt: Date;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anicrew-watchlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('anicrew-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((animeId: string) => {
    setWatchlist(prev => {
      if (prev.includes(animeId)) return prev;
      return [...prev, animeId];
    });
  }, []);

  const removeFromWatchlist = useCallback((animeId: string) => {
    setWatchlist(prev => prev.filter(id => id !== animeId));
  }, []);

  const isInWatchlist = useCallback((animeId: string) => {
    return watchlist.includes(animeId);
  }, [watchlist]);

  const toggleWatchlist = useCallback((animeId: string) => {
    if (watchlist.includes(animeId)) {
      removeFromWatchlist(animeId);
    } else {
      addToWatchlist(animeId);
    }
  }, [watchlist, addToWatchlist, removeFromWatchlist]);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
};
