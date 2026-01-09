import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VideoPlayer from '@/components/player/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Download, Bookmark, ThumbsUp, MessageCircle, Share2, Clock,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useUserProfile } from '@/hooks/useUserProfile';
import { trendingAnime } from '@/data/mockAnime';
import { getEpisodesForAnime } from '@/data/mockEpisodes';
import { mockComments } from '@/data/mockComments';
import { toast } from 'sonner';

interface DisplayComment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: Date;
  likes: number;
}

const WatchPage: React.FC = () => {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const { saveProgress } = useWatchProgress();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<DisplayComment[]>(() => 
    mockComments.map(c => ({
      id: c.id,
      username: c.username,
      avatar: c.avatar,
      content: c.content,
      createdAt: c.createdAt,
      likes: c.likes,
    }))
  );
  const [isLiked, setIsLiked] = useState(false);

  // Find anime and episode
  const anime = trendingAnime.find(a => a.id === animeId);
  const episodes = animeId ? getEpisodesForAnime(animeId) : [];
  const currentEpNum = parseInt(episodeId || '1');
  const currentEpisode = episodes.find(e => e.number === currentEpNum) || episodes[0];
  
  const prevEpisode = currentEpNum > 1 ? currentEpNum - 1 : null;
  const nextEpisode = currentEpNum < episodes.length ? currentEpNum + 1 : null;

  // Save progress on episode change
  useEffect(() => {
    if (animeId && episodeId) {
      saveProgress(animeId, episodeId, 0, 1440);
    }
  }, [animeId, episodeId, saveProgress]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: DisplayComment = {
      id: Date.now().toString(),
      username: profile.username,
      avatar: profile.avatar,
      content: newComment,
      createdAt: new Date(),
      likes: 0,
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comment posted!');
  };

  const handleDownload = () => {
    if (!profile.isPremium) {
      toast.error('Premium subscription required to download');
      navigate('/premium');
      return;
    }
    toast.success('Starting download...');
  };

  if (!anime || !currentEpisode) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Episode not found</h1>
            <Link to="/anime">
              <Button>Browse Anime</Button>
            </Link>
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
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/anime" className="hover:text-foreground transition-colors">Anime</Link>
            <span>/</span>
            <Link to={`/anime/${animeId}`} className="hover:text-foreground transition-colors">{anime.title}</Link>
            <span>/</span>
            <span className="text-foreground">Episode {currentEpNum}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <VideoPlayer
                title={anime.title}
                episodeTitle={currentEpisode.title}
                episodeNumber={currentEpNum}
                thumbnail={anime.image}
                onPrev={() => prevEpisode && navigate(`/watch/${animeId}/${prevEpisode}`)}
                onNext={() => nextEpisode && navigate(`/watch/${animeId}/${nextEpisode}`)}
                hasPrev={!!prevEpisode}
                hasNext={!!nextEpisode}
              />

              {/* Episode Navigation & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!prevEpisode}
                    onClick={() => prevEpisode && navigate(`/watch/${animeId}/${prevEpisode}`)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!nextEpisode}
                    onClick={() => nextEpisode && navigate(`/watch/${animeId}/${nextEpisode}`)}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isInWatchlist(animeId || '') ? "secondary" : "outline"}
                    onClick={() => {
                      toggleWatchlist(animeId || '');
                      toast.success(isInWatchlist(animeId || '') ? 'Removed from watchlist' : 'Added to watchlist');
                    }}
                  >
                    <Bookmark className="w-4 h-4 mr-1" fill={isInWatchlist(animeId || '') ? "currentColor" : "none"} />
                    {isInWatchlist(animeId || '') ? 'Saved' : 'Watchlist'}
                  </Button>
                  <Button
                    variant={isLiked ? "secondary" : "outline"}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" fill={isLiked ? "currentColor" : "none"} />
                    Like
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button 
                    variant={profile.isPremium ? "default" : "outline"}
                    onClick={handleDownload}
                    className={profile.isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500" : ""}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                    {!profile.isPremium && <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>}
                  </Button>
                </div>
              </div>

              {/* Note: Audio, Subtitle, Quality, Speed settings are now in the VideoPlayer settings menu */}

              {/* Comments Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Comments ({comments.length})
                  </h3>

                  {/* Add Comment */}
                  <div className="mb-6">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="mb-2"
                      rows={3}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{newComment.length}/500</span>
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{comment.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.username}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {comment.likes}
                            </button>
                            <button className="text-xs text-muted-foreground hover:text-foreground">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Episode List */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Episodes</h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {episodes.map(ep => (
                      <Link
                        key={ep.id}
                        to={`/watch/${animeId}/${ep.number}`}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          ep.number === currentEpNum 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="w-20 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                          <img 
                            src={ep.thumbnail} 
                            alt={ep.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">EP {ep.number}</p>
                          <p className="text-xs truncate opacity-80">{ep.title}</p>
                          <div className="flex items-center gap-2 text-xs opacity-70">
                            <Clock className="w-3 h-3" />
                            {ep.duration}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Anime Info Card */}
              <Card>
                <CardContent className="p-4">
                  <img 
                    src={anime.image} 
                    alt={anime.title}
                    className="w-full aspect-[3/4] object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold mb-2">{anime.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {anime.genres.map(genre => (
                      <Badge key={genre} variant="outline" className="text-xs">{genre}</Badge>
                    ))}
                  </div>
                  <Link to={`/anime/${animeId}`}>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WatchPage;