import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/hooks/useSearch';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Sports'];

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { query, setQuery, filters, setFilters, searchResults, recommendations } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              placeholder="Search anime, donghua... (typos are okay!)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-lg bg-secondary/50 border-border/50"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          {(filters.type !== 'all' || filters.genre || filters.status !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ type: 'all', genre: '', language: '', status: 'all' })}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value as 'all' | 'anime' | 'donghua' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="donghua">Donghua</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.genre || 'all'}
              onValueChange={(value) => setFilters({ ...filters, genre: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value as 'all' | 'ongoing' | 'completed' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Results or Recommendations */}
        <div className="mt-6">
          {query.trim() ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                {searchResults.length} results for "{query}"
              </h3>
              {searchResults.length > 0 ? (
                <div className="grid gap-3">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/anime/${item.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 rounded-lg bg-card hover:bg-secondary/50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="capitalize">
                            {item.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.episodes} episodes
                          </span>
                          <span className="text-sm text-primary">★ {item.rating}</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {item.genres.map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No results found. Try a different search term or adjust filters.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recommended For You</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recommendations.map((item) => (
                  <Link
                    key={item.id}
                    to={`/anime/${item.id}`}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <Badge variant="secondary" className="capitalize mb-1">
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
