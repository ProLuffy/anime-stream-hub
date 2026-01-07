// Watchlist Page - With Share Functionality
import React, { useState, useEffect } from 'react';
import { api, Episode } from '../utils/api';

const WatchlistPage: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('anicrew_user');
    if (!userData) {
      alert('Please login first');
      window.location.href = '/login';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadWatchlist(parsedUser.email);
  }, []);

  const loadWatchlist = async (userEmail: string) => {
    setLoading(true);
    try {
      const slugs = await api.getWatchlist(userEmail);
      
      // Fetch full episode details
      const episodePromises = slugs.map(slug => api.getEpisode(slug).catch(() => null));
      const episodesData = (await Promise.all(episodePromises)).filter(Boolean) as Episode[];
      setEpisodes(episodesData);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    }
    setLoading(false);
  };

  const shareWatchlist = () => {
    if (!user) return;
    
    const url = `${window.location.origin}/watchlist/${user.email}`;
    navigator.clipboard.writeText(url);
    alert('🔗 Watchlist link copied to clipboard!');
  };

  const handleRemove = async (slug: string) => {
    // TODO: Backend needs remove endpoint
    // For now show message
    alert('Remove functionality will be added in next update!');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="watchlist-page" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📚 My Watchlist ({episodes.length})</h1>
        <button 
          onClick={shareWatchlist}
          style={{
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔗 Share Watchlist
        </button>
      </div>

      {loading ? (
        <div>Loading your watchlist...</div>
      ) : episodes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h2>Your watchlist is empty</h2>
          <p>Browse anime/donghua and add episodes to your watchlist!</p>
          <button onClick={() => window.location.href = '/anime'} style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            Browse Anime
          </button>
        </div>
      ) : (
        <div className="watchlist-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px'
        }}>
          {episodes.map(ep => (
            <div key={ep.slug} className="watchlist-card anime-card" style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              background: '#fff'
            }}>
              <h3>{ep.anime_title}</h3>
              <p>Episode {ep.episode_number}</p>
              <p>🎧 {ep.audio_languages.join(', ')}</p>
              <p style={{ fontSize: '12px', color: '#999' }}>
                Added: {new Date(ep.created_at).toLocaleDateString()}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => window.location.href = `/watch/${ep.slug}`}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  ▶️ Watch
                </button>
                <button 
                  onClick={() => handleRemove(ep.slug)}
                  style={{
                    padding: '10px 15px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;