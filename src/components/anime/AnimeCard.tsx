import React from 'react';
import { Play, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export interface AnimeCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  episodes: number;
  type: 'anime' | 'donghua';
  status: 'ongoing' | 'completed';
  genres: string[];
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  id,
  title,
  image,
  rating,
  episodes,
  type,
  status,
  genres,
}) => {
  return (
    <Link to={`/watch/${id}`} className="anime-card group block">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="anime-card-image"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs uppercase"
        >
          {type}
        </Badge>

        {/* Status Badge */}
        {status === 'ongoing' && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs">
            Ongoing
          </Badge>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
            {rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {episodes} EP
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {genres.slice(0, 2).map((genre) => (
            <span 
              key={genre} 
              className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
