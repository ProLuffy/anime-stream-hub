// Watch Page - Video Player with Comments
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, Episode, Comment } from '../utils/api';

const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadEpisode(slug);
      loadComments(slug);
    }
    
    const userData = localStorage.getItem('anicrew_user');
    if (userData) setUser(JSON.parse(userData));
  }, [slug]);

  const loadEpisode = async (episodeSlug: string) => {
    try {
      const data = await api.getEpisode(episodeSlug);
      setEpisode(data);
    } catch (error) {
      console.error('Failed to load episode:', error);
    }
    setLoading(false);
  };

  const loadComments = async (episodeSlug: string) => {
    try {
      const data = await api.getComments(episodeSlug);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please login to comment');
      window.location.href = '/login';
      return;
    }
    
    if (!newComment.trim() || !slug) return;
    
    try {
      await api.addComment(slug, user.email, user.name, newComment);
      setNewComment('');
      loadComments(slug);
    } catch (error) {
      alert('Failed to post comment');
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert('Please login first');
      window.location.href = '/login';
      return;
    }
    
    if (!slug) return;
    
    try {
      await api.addToWatchlist(slug, user.email);
      alert('✅ Added to watchlist!');
    } catch (error) {
      alert('Failed to add to watchlist');
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  if (!episode) return <div style={{ padding: '50px', textAlign: 'center' }}>Episode not found</div>;

  return (
    <div className="watch-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Episode Title */}
      <h1 style={{ marginBottom: '20px' }}>
        {episode.anime_title} - Episode {episode.episode_number}
      </h1>
      
      {/* Video Player */}
      <div className="video-container" style={{ marginBottom: '30px', borderRadius: '12px', overflow: 'hidden' }}>
        <iframe
          src={episode.streamtape_embed}
          width="100%"
          height="600px"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          style={{ border: 'none' }}
        />
      </div>

      {/* Episode Meta Info */}
      <div className="episode-meta" style={{
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <p><strong>🎧 Audio:</strong> {episode.audio_languages.join(', ')}</p>
            <p><strong>👁️ Views:</strong> {episode.view_count}</p>
            <p><strong>📺 Source:</strong> {episode.source}</p>
          </div>
          <div>
            <button 
              onClick={handleAddToWatchlist}
              style={{
                padding: '12px 24px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ➕ Add to Watchlist
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section" style={{ marginTop: '40px' }}>
        <h2>💬 Comments ({comments.length})</h2>
        
        {/* Add Comment */}
        {user ? (
          <div className="add-comment" style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              maxLength={500}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {newComment.length}/500 characters
              </span>
              <button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                style={{
                  padding: '10px 20px',
                  background: newComment.trim() ? '#4CAF50' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: newComment.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Post Comment
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <a href="/login" style={{ color: '#856404', textDecoration: 'none' }}>
              Login to post comments →
            </a>
          </div>
        )}

        {/* Comments List */}
        <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {comments.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment" style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ color: '#333' }}>{comment.user_name}</strong>
                  <small style={{ color: '#999' }}>
                    {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                  </small>
                </div>
                <p style={{ color: '#555', margin: '10px 0' }}>{comment.content}</p>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  👍 {comment.likes} likes
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;