import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimeCard from '@/components/anime/AnimeCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, SortAsc, Grid, List, X, Loader2 } from 'lucide-react';
import { popularDonghua, trendingAnime } from '@/data/mockAnime';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Use popular donghua + add more for demo
const allDonghua = [...popularDonghua.map(d => ({ ...d, type: 'donghua' as const })), ...trendingAnime.map(a => ({ ...a, type: 'donghua' as const }))];

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Martial Arts',
  'Romance', 'Cultivation', 'Isekai', 'Historical', 'Mystery'
];

const languages = ['Chinese', 'English', 'Hindi', 'Japanese'];
const years = ['2024', '2023', '2022', '2021', '2020'];
const statuses = ['Airing', 'Completed', 'Upcoming'];
const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name A-Z' },
];

const DonghuaBrowse: React.FC = () => {
  const [donghuaList, setDonghuaList] = useState(allDonghua);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    setTimeout(() => {
      const moreDonghua = allDonghua.map(a => ({
        ...a,
        id: `${a.id}-page-${page + 1}`,
      }));
      setDonghuaList(prev => [...prev, ...moreDonghua]);
      setPage(p => p + 1);
      setLoading(false);
      if (page >= 3) setHasMore(false);
    }, 800);
  }, [loading, hasMore, page]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loading]);

  const filteredDonghua = donghuaList.filter(anime => {
    if (selectedGenres.length > 0 && !anime.genres.some(g => selectedGenres.includes(g))) {
      return false;
    }
    if (selectedStatus !== 'all' && anime.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const sortedDonghua = [...filteredDonghua].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return parseInt(b.year || '0') - parseInt(a.year || '0');
      case 'name-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguage('all');
    setSelectedYear('all');
    setSelectedStatus('all');
    setSortBy('popularity');
  };

  const activeFilterCount = selectedGenres.length + 
    (selectedLanguage !== 'all' ? 1 : 0) + 
    (selectedYear !== 'all' ? 1 : 0) + 
    (selectedStatus !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">🏮 Browse Donghua</h1>
            <p className="text-muted-foreground">Discover the best Chinese animation</p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1">{activeFilterCount}</Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                {sortedDonghua.length} results
              </span>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Genres */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <Badge
                        key={genre}
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80 transition-colors"
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Language</h4>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any language</SelectItem>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Year</h4>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any year</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Status</h4>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Donghua Grid */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "flex flex-col gap-4"
          }>
            {sortedDonghua.map((anime, index) => (
              <AnimeCard key={`${anime.id}-${index}`} {...anime} />
            ))}
          </div>

          {/* Load More */}
          <div ref={loadMoreRef} className="py-12 flex justify-center">
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
            {!hasMore && !loading && (
              <p className="text-muted-foreground">No more donghua to load</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonghuaBrowse;
