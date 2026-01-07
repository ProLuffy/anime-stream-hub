import React from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Episode } from '@/data/mockEpisodes';
import { useWatchProgress } from '@/hooks/useWatchProgress';

interface EpisodeListProps {
  episodes: Episode[];
  animeId: string;
  currentEpisodeId?: string;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, animeId, currentEpisodeId }) => {
  const { getProgress } = useWatchProgress();

  return (
    <div className="space-y-3">
      {episodes.map((episode) => {
        const progress = getProgress(animeId, episode.id);
        const isWatched = progress && progress.timestamp / progress.duration > 0.9;
        const isCurrent = episode.id === currentEpisodeId;

        return (
          <Link
            key={episode.id}
            to={`/watch/${animeId}/${episode.id}`}
            className={`flex gap-4 p-3 rounded-lg transition-colors ${
              isCurrent
                ? 'bg-primary/20 border border-primary'
                : 'bg-card hover:bg-secondary/50'
            }`}
          >
            <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={episode.thumbnail}
                alt={episode.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white" />
              </div>
              {progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(progress.timestamp / progress.duration) * 100}%` }}
                  />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">Episode {episode.number}</span>
                {isWatched && <CheckCircle2 className="w-4 h-4 text-primary" />}
                {isCurrent && <Badge variant="secondary">Playing</Badge>}
              </div>
              <h4 className="text-sm text-foreground/80 mb-1 truncate">{episode.title}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{episode.duration}</span>
                <span>•</span>
                <span>{episode.releaseDate}</span>
              </div>
              <div className="flex gap-1 mt-1">
                {episode.languages.slice(0, 3).map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default EpisodeList;
