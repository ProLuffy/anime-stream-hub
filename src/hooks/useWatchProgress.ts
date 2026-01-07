import { useState, useCallback, useEffect } from 'react';

export interface WatchProgress {
  animeId: string;
  episodeId: string;
  timestamp: number; // in seconds
  duration: number;
  lastWatched: Date;
}

export const useWatchProgress = () => {
  const [progress, setProgress] = useState<Record<string, WatchProgress>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anicrew-watch-progress');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('anicrew-watch-progress', JSON.stringify(progress));
  }, [progress]);

  const saveProgress = useCallback((
    animeId: string,
    episodeId: string,
    timestamp: number,
    duration: number
  ) => {
    setProgress(prev => ({
      ...prev,
      [`${animeId}-${episodeId}`]: {
        animeId,
        episodeId,
        timestamp,
        duration,
        lastWatched: new Date(),
      },
    }));
  }, []);

  const getProgress = useCallback((animeId: string, episodeId: string): WatchProgress | null => {
    return progress[`${animeId}-${episodeId}`] || null;
  }, [progress]);

  const getAnimeProgress = useCallback((animeId: string): WatchProgress[] => {
    return Object.values(progress).filter(p => p.animeId === animeId);
  }, [progress]);

  const clearProgress = useCallback((animeId?: string, episodeId?: string) => {
    if (animeId && episodeId) {
      setProgress(prev => {
        const updated = { ...prev };
        delete updated[`${animeId}-${episodeId}`];
        return updated;
      });
    } else if (animeId) {
      setProgress(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (key.startsWith(`${animeId}-`)) {
            delete updated[key];
          }
        });
        return updated;
      });
    } else {
      setProgress({});
      localStorage.removeItem('anicrew-watch-progress');
    }
  }, []);

  return {
    progress,
    saveProgress,
    getProgress,
    getAnimeProgress,
    clearProgress,
  };
};
