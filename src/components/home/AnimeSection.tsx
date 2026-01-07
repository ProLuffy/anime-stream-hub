import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimeCard, { AnimeCardProps } from '@/components/anime/AnimeCard';
import { Link } from 'react-router-dom';

interface AnimeSectionProps {
  title: string;
  subtitle?: string;
  animeList: AnimeCardProps[];
  viewAllLink?: string;
}

const AnimeSection: React.FC<AnimeSectionProps> = ({
  title,
  subtitle,
  animeList,
  viewAllLink,
}) => {
  return (
    <section className="py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {viewAllLink && (
          <Link to={viewAllLink}>
            <Button variant="ghost" className="gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {animeList.map((anime, index) => (
          <div
            key={anime.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <AnimeCard {...anime} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimeSection;
