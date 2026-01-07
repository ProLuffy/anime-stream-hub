import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, Download, Settings2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import EpisodeList from '@/components/anime/EpisodeList';
import { trendingAnime, latestReleases, popularDonghua } from '@/data/mockAnime';
import { getEpisodesForAnime, Episode } from '@/data/mockEpisodes';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { useSearch } from '@/hooks/useSearch';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

const allAnime = [...trendingAnime, ...latestReleases, ...popularDonghua];

const WatchPage: React.FC = () => {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const navigate = useNavigate();
  const { saveProgress, getProgress } = useWatchProgress();
  const { addToWatchHistory } = useSearch();
  const { profile } = useUserProfile();
  
  const [selectedLanguage, setSelectedLanguage] = useState('Japanese');
  const [selectedSubtitle, setSelectedSubtitle] = useState('English');
  const [isEpisodeListOpen, setIsEpisodeListOpen] = useState(false);

  const anime = allAnime.find(a => a.id === animeId);
  const episodes = getEpisodesForAnime(animeId || '', anime?.episodes || 5);
  const currentEpisode = episodes.find(e => e.id === episodeId) || episodes[0];
  const currentIndex = episodes.findIndex(e => e.id === episodeId);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  // Add to watch history when page loads
  useEffect(() => {
    if (animeId) {
      addToWatchHistory(animeId);
    }
  }, [animeId, addToWatchHistory]);

  // Simulate watch progress tracking
  useEffect(() => {
    if (animeId && episodeId) {
      const interval = setInterval(() => {
        // Simulate progress update (in a real app, this would come from the video player)
        const mockTimestamp = Math.floor(Math.random() * 1400);
        saveProgress(animeId, episodeId, mockTimestamp, 1440);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [animeId, episodeId, saveProgress]);

  const handleDownload = () => {
    if (!profile.isPremium) {
      toast.error('Premium subscription required to download');
      return;
    }
    toast.success('Download started...');
  };

  if (!anime || !currentEpisode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Episode Not Found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Area */}
      <div className="relative w-full aspect-video bg-black">
        {/* StreamTape Embed Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary/20 to-background">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-0 h-0 border-l-[30px] border-l-primary border-y-[20px] border-y-transparent ml-2" />
            </div>
            <p className="text-muted-foreground mb-2">StreamTape Player</p>
            <p className="text-sm text-muted-foreground">
              Episode {currentEpisode.number}: {currentEpisode.title}
            </p>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <Link to={`/anime/${animeId}`}>
              <Button variant="ghost" size="sm" className="text-white gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to {anime.title}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {anime.type}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-4">
          {/* Episode Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {prevEpisode ? (
                <Link to={`/watch/${animeId}/${prevEpisode.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled className="gap-1">
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
              )}
              {nextEpisode ? (
                <Link to={`/watch/${animeId}/${nextEpisode.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled className="gap-1">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Audio" />
                </SelectTrigger>
                <SelectContent>
                  {currentEpisode.languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subtitle Selector */}
              <Select value={selectedSubtitle} onValueChange={setSelectedSubtitle}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Subtitles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  {currentEpisode.subtitles.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Download Button */}
              <Button
                variant={profile.isPremium ? 'default' : 'outline'}
                size="sm"
                className="gap-1"
                onClick={handleDownload}
              >
                {profile.isPremium ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <Crown className="w-4 h-4" />
                )}
                Download
              </Button>

              {/* Episode List Sheet */}
              <Sheet open={isEpisodeListOpen} onOpenChange={setIsEpisodeListOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <List className="w-4 h-4" />
                    Episodes
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{anime.title}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <EpisodeList
                      episodes={episodes}
                      animeId={anime.id}
                      currentEpisodeId={currentEpisode.id}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Current Episode Info */}
          <div className="bg-card rounded-lg p-4">
            <div className="flex items-start gap-4">
              <img
                src={currentEpisode.thumbnail}
                alt={currentEpisode.title}
                className="w-32 aspect-video object-cover rounded-lg"
              />
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  Episode {currentEpisode.number}: {currentEpisode.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{currentEpisode.duration}</span>
                  <span>•</span>
                  <span>{currentEpisode.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Audio:</span>
                  <Badge variant="secondary">{selectedLanguage}</Badge>
                  <span className="text-muted-foreground ml-2">Subtitles:</span>
                  <Badge variant="secondary">{selectedSubtitle}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
