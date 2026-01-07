// AniCrew API Utility - Backend Integration

const API_BASE = 'https://runtime.codewords.ai/anicrew_episode_api_935ba891';
const ADVANCED_API = 'https://runtime.codewords.ai/anicrew_advanced_api_4dba6ed6';

export interface Episode {
  anime_title: string;
  slug: string;
  episode_number: number;
  source: string;
  content_type: 'anime' | 'donghua';
  audio_languages: string[];
  streamtape_embed: string;
  streamtape_download: string;
  thumbnail_url?: string;
  original_link: string;
  created_at: string;
  view_count: number;
}

export interface Comment {
  id: string;
  episode_slug: string;
  user_email: string;
  user_name: string;
  content: string;
  created_at: string;
  likes: number;
}

export const api = {
  getEpisodes: async (page = 1, filters: { content_type?: string; source?: string } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: '20',
      ...(filters.content_type && { content_type: filters.content_type }),
      ...(filters.source && { source: filters.source })
    });
    const res = await fetch(`${API_BASE}/api/episodes?${params}`);
    return res.json() as Promise<{ episodes: Episode[]; total: number; page: number; per_page: number }>;
  },

  getEpisode: async (slug: string) => {
    const res = await fetch(`${API_BASE}/api/episodes/${slug}`);
    const data = await res.json();
    return data.episode as Episode;
  },

  search: async (query: string, filters = {}) => {
    const res = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, ...filters })
    });
    const data = await res.json();
    return data.results as Episode[];
  },

  addToWatchlist: async (episodeSlug: string, userEmail: string) => {
    const res = await fetch(`${API_BASE}/api/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episode_slug: episodeSlug, user_email: userEmail })
    });
    return res.json();
  },

  getWatchlist: async (userEmail: string) => {
    const res = await fetch(`${API_BASE}/api/watchlist?user_email=${encodeURIComponent(userEmail)}`);
    const data = await res.json();
    return data.watchlist as string[];
  },

  googleLogin: async (idToken: string) => {
    const res = await fetch(`${ADVANCED_API}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken })
    });
    return res.json();
  },

  addComment: async (episodeSlug: string, userEmail: string, userName: string, content: string) => {
    const res = await fetch(`${ADVANCED_API}/comments/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episode_slug: episodeSlug, user_email: userEmail, user_name: userName, content })
    });
    return res.json();
  },

  getComments: async (episodeSlug: string) => {
    const res = await fetch(`${ADVANCED_API}/comments/${episodeSlug}`);
    const data = await res.json();
    return data.comments as Comment[];
  },

  createCheckout: async (userEmail: string, plan: 'monthly' | 'yearly' = 'monthly') => {
    const res = await fetch(`${ADVANCED_API}/premium/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: userEmail, plan })
    });
    return res.json() as Promise<{ checkout_url: string; session_id: string }>;
  },

  getPremiumStatus: async (userEmail: string) => {
    const res = await fetch(`${ADVANCED_API}/premium/status/${userEmail}`);
    return res.json() as Promise<{ is_premium: boolean; plan?: string; expires_at?: string }>;
  }
};