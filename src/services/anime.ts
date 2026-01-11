import api from "./api";

// API Base URL from environment
const API_BASE = import.meta.env.VITE_API_URL || 'https://townbackend-825d5dfe9e19.herokuapp.com/api';

export interface StreamSource {
  quality: string;
  url: string;
  type: 'streamtape' | 'doodstream' | 'direct';
}

export interface Subtitle {
  language: string;
  label: string;
  url: string;
}

export interface AudioTrack {
  language: string;
  label: string;
  default: boolean;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  airDate: string;
  description?: string;
  streams: StreamSource[];
  subtitles: Subtitle[];
  audioTracks: AudioTrack[];
  downloadUrl?: string;
}

export interface AnimeDetail {
  id: string;
  title: string;
  image: string;
  coverImage?: string;
  description: string;
  genres: string[];
  rating: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  type: 'anime' | 'donghua';
  episodes: Episode[];
  totalEpisodes: number;
  releaseYear: number;
  studio?: string;
}

export const getAnimeList = async () => {
  try {
    const res = await api.get("/anime");
    return res.data;
  } catch (error) {
    console.error('Error fetching anime list:', error);
    throw error;
  }
};

export const getAnimeById = async (id: string): Promise<AnimeDetail> => {
  try {
    const res = await api.get(`/anime/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const getEpisode = async (animeId: string, episodeNumber: number): Promise<Episode> => {
  try {
    const res = await api.get(`/anime/${animeId}/episode/${episodeNumber}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching episode:', error);
    throw error;
  }
};

export const getStreamUrl = async (animeId: string, episodeNumber: number, quality: string): Promise<string> => {
  try {
    const res = await api.get(`/anime/${animeId}/episode/${episodeNumber}/stream`, {
      params: { quality }
    });
    return res.data.url;
  } catch (error) {
    console.error('Error fetching stream URL:', error);
    throw error;
  }
};

export const getDownloadUrl = async (animeId: string, episodeNumber: number, quality: string): Promise<string> => {
  try {
    const res = await api.get(`/anime/${animeId}/episode/${episodeNumber}/download`, {
      params: { quality }
    });
    return res.data.url;
  } catch (error) {
    console.error('Error fetching download URL:', error);
    throw error;
  }
};

export const searchAnime = async (query: string, filters?: {
  type?: 'anime' | 'donghua';
  status?: 'ongoing' | 'completed' | 'upcoming';
  genre?: string;
}) => {
  try {
    const res = await api.get('/anime/search', {
      params: { q: query, ...filters }
    });
    return res.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};
