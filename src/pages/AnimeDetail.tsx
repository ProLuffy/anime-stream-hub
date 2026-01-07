import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, Star, Calendar, Film, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EpisodeList from '@/components/anime/EpisodeList';
import CommentSection from '@/components/anime/CommentSection';
import { trendingAnime, latestReleases, popularDonghua } from '@/data/mockAnime';
import { getEpisodesForAnime } from '@/data/mockEpisodes';
import { getCommentsForAnime } from '@/data/mockComments';
import { useWatchlist } from '@/hooks/useWatchlist';
import { toast } from 'sonner';

const allAnime = [...trendingAnime, ...latestReleases, ...popularDonghua];

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  const anime = allAnime.find(a => a.id === id);
  const episodes = getEpisodesForAnime(id || '', anime?.episodes || 5);
  const comments = getCommentsForAnime(id || '');
  const inWatchlist = isInWatchlist(id || '');

  if (!anime) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Anime Not Found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWatchlistToggle = () => {
    toggleWatchlist(anime.id);
    toast.success(inWatchlist ? 'Removed from watchlist' : 'Added to watchlist');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={anime.image}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <img
              src={anime.image}
              alt={anime.title}
              className="w-full aspect-[3/4] object-cover rounded-xl shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
              <Badge variant="secondary" className="capitalize">
                {anime.type}
              </Badge>
              <Badge variant={anime.status === 'ongoing' ? 'default' : 'outline'}>
                {anime.status}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{anime.title}</h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-foreground">{anime.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Film className="w-4 h-4" />
                <span>{anime.episodes} Episodes</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>2024</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
              {anime.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground mb-6 max-w-2xl">
              An epic adventure filled with action, drama, and unforgettable moments. 
              Follow our heroes as they face incredible challenges and discover the true 
              meaning of friendship and courage.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link to={`/watch/${anime.id}/${episodes[0]?.id}`}>
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Watch Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant={inWatchlist ? 'secondary' : 'outline'}
                className="gap-2"
                onClick={handleWatchlistToggle}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-5 h-5" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add to Watchlist
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="episodes" className="mt-12">
          <TabsList className="mb-6">
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="related">Related</TabsTrigger>
          </TabsList>

          <TabsContent value="episodes">
            <EpisodeList episodes={episodes} animeId={anime.id} />
          </TabsContent>

          <TabsContent value="comments">
            <CommentSection comments={comments} animeId={anime.id} />
          </TabsContent>

          <TabsContent value="related">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allAnime
                .filter(a => a.id !== anime.id && a.genres.some(g => anime.genres.includes(g)))
                .slice(0, 6)
                .map((related) => (
                  <Link key={related.id} to={`/anime/${related.id}`} className="group">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2">{related.title}</h4>
                  </Link>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AnimeDetail;
