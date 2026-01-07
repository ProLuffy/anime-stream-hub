import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AnimeSection from '@/components/home/AnimeSection';
import SearchFilters from '@/components/home/SearchFilters';
import { trendingAnime, latestReleases, popularDonghua } from '@/data/mockAnime';

const Index: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Search & Filters */}
          <SearchFilters
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGenres={selectedGenres}
            onGenreToggle={handleGenreToggle}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />

          {/* Trending Section */}
          <AnimeSection
            title="Trending Now"
            subtitle="Most popular this week"
            animeList={trendingAnime}
            viewAllLink="/trending"
          />

          {/* Latest Releases */}
          <AnimeSection
            title="Latest Releases"
            subtitle="Fresh episodes just dropped"
            animeList={latestReleases}
            viewAllLink="/new-releases"
          />

          {/* Popular Donghua */}
          <AnimeSection
            title="Popular Donghua"
            subtitle="Best Chinese animation"
            animeList={popularDonghua}
            viewAllLink="/donghua"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
