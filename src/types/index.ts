export interface Series {
  _id: string;
  title: string;
  cover: string;
  banner?: string;
  description: string;
  genres: string[];
  year: number;
  rating?: number;
  type: 'anime' | 'donghua';
  language: string;
  status: 'pending' | 'extracting' | 'completed' | 'failed';
}

export interface Episode {
  _id: string;
  seriesId: string;
  title: string;
  episodeNumber: number;
  streamtapeUrl: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  progress: number;
}

export interface DashboardStats {
  series: number;
  episodes: {
    total: number;
    ready: number;
    processing: number;
    failed: number;
  };
}
