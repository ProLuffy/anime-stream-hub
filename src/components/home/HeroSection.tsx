import React from 'react';
import { Play, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

interface HeroAnime {
  id: string;
  title: string;
  description: string;
  image: string;
  genres: string[];
}

const featuredAnime: HeroAnime = {
  id: '1',
  title: 'Solo Leveling: Arise',
  description: 'In a world where hunters with supernatural abilities battle deadly monsters, Sung Jin-woo, the weakest of all hunters, finds a mysterious program that lets him level up without limits.',
  image: heroBanner,
  genres: ['Action', 'Fantasy', 'Adventure'],
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredAnime.image}
          alt={featuredAnime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl animate-fade-up">
          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {featuredAnime.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {featuredAnime.title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
            {featuredAnime.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2 gradient-bg text-primary-foreground hover:opacity-90">
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Now
            </Button>
            <Button size="lg" variant="secondary" className="gap-2">
              <Plus className="w-5 h-5" />
              Add to List
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Info className="w-5 h-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
