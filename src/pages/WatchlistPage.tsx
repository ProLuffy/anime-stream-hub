import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWatchlist } from '@/hooks/useWatchlist';
import { trendingAnime, latestReleases, popularDonghua } from '@/data/mockAnime';
import { 
  Play, Trash2, Share2, Copy, Check, BookmarkX, 
  Calendar, Star 
} from 'lucide-react';
import { toast } from 'sonner';

const allAnime = [...trendingAnime, ...latestReleases, ...popularDonghua];

const WatchlistPage: React.FC = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Map watchlist IDs to anime data
  const watchlistAnime = watchlist.map(id => 
    allAnime.find(a => a.id === id)
  ).filter(Boolean);

  useEffect(() => {
    // Generate shareable URL
    const url = `${window.location.origin}/watchlist/shared?ids=${watchlist.join(',')}`;
    setShareUrl(url);
  }, [watchlist]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My AniCrew Watchlist',
          text: `Check out my anime watchlist with ${watchlist.length} titles!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Watchlist link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleRemove = (id: string, title: string) => {
    removeFromWatchlist(id);
    toast.success(`Removed "${title}" from watchlist`);
  };

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-4 py-16">
            <BookmarkX className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">Your Watchlist is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding anime and donghua to your watchlist to keep track of what you want to watch.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/anime">
                <Button>Browse Anime</Button>
              </Link>
              <Link to="/donghua">
                <Button variant="outline">Browse Donghua</Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">📚 My Watchlist</h1>
              <p className="text-muted-foreground">{watchlist.length} titles saved</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Share'}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  clearWatchlist();
                  toast.success('Watchlist cleared');
                }}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Watchlist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistAnime.map((anime) => anime && (
              <Card key={anime.id} className="overflow-hidden hover:shadow-elevated transition-shadow">
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="w-32 h-44 flex-shrink-0 relative">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className="absolute top-2 left-2"
                      variant={anime.type === 'anime' ? 'default' : 'secondary'}
                    >
                      {anime.type}
                    </Badge>
                  </div>
                  
                  {/* Info */}
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold line-clamp-2 mb-2">{anime.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          {anime.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {anime.episodes} EP
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {anime.genres.slice(0, 2).map(genre => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Link to={`/anime/${anime.id}`} className="flex-1">
                        <Button size="sm" className="w-full gap-1">
                          <Play className="w-3 h-3" />
                          Watch
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRemove(anime.id, anime.title)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WatchlistPage;