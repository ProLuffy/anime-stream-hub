import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AnimeSection from '@/components/home/AnimeSection';
import SearchFilters from '@/components/home/SearchFilters';
import { Series } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

const Home: React.FC = () => {
  const [allSeries, setAllSeries] = useState<Series[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/gallery`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        const series = data?.data || [];
        setAllSeries(series);
        setFilteredSeries(series);
      })
      .catch(err => {
        console.error('Gallery fetch failed:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = allSeries;

    if (searchQuery) {
      result = result.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenres.length > 0) {
      result = result.filter(s =>
        selectedGenres.every(g => s.genres?.includes(g))
      );
    }

    if (selectedType !== 'all') {
      result = result.filter(s => s.type === selectedType);
    }

    if (selectedLanguage !== 'all') {
      result = result.filter(
        s => s.language?.toLowerCase() === selectedLanguage
      );
    }

    setFilteredSeries(result);
  }, [searchQuery, selectedGenres, selectedType, selectedLanguage, allSeries]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <SearchFilters
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGenres={selectedGenres}
          onGenreToggle={(g) =>
            setSelectedGenres(prev =>
              prev.includes(g)
                ? prev.filter(x => x !== g)
                : [...prev, g]
            )
          }
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            Loading anime...
          </div>
        ) : (
          <AnimeSection
            title="Explore Library"
            animeList={filteredSeries.map(s => ({
              id: s._id,
              title: s.title,
              image: s.cover,
              rating: s.rating?.toString() || '8.5',
              episodes: s.episodes || 0,
              type: s.type,
              status: s.status === 'completed' ? 'finished' : 'ongoing',
            })}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
