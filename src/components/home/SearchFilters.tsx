import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life'
];

const languages = [
  'Japanese', 'Chinese', 'English', 'Hindi', 'Tamil', 'Telugu'
];

interface SearchFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  isOpen,
  onToggle,
  searchQuery,
  onSearchChange,
  selectedGenres,
  onGenreToggle,
  selectedType,
  onTypeChange,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anime, donghua by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant={isOpen ? 'default' : 'outline'} 
          onClick={onToggle}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Expandable Filters */}
      {isOpen && (
        <div className="space-y-4 pt-4 border-t border-border animate-fade-up">
          {/* Type & Language */}
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="donghua">Donghua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={onLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="text-sm font-medium mb-2 block">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onGenreToggle(genre)}
                >
                  {genre}
                  {selectedGenres.includes(genre) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
