// Donghua Browse Page - Backend integrated
import React, { useState, useEffect } from 'react';
import { api, Episode } from '../utils/api';

const DonghuaBrowse: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadEpisodes();
  }, [page]);

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      const data = await api.getEpisodes(page, { content_type: 'donghua' });
      setEpisodes(data.episodes);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load donghua:', error);
    }
    setLoading(false);
  };

  return (
    <div className="donghua-browse" style={{ padding: '20px' }}>
      <h1>🎉 Browse Donghua (Chinese Anime)</h1>
      
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Total: {total} episodes available
      </p>

      {/* Episode Grid */}
      <div className="episode-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {loading ? (
          <div>Loading donghua...</div>
        ) : episodes.length === 0 ? (
          <div>No donghua found. Scraper will add content daily!</div>
        ) : (
          episodes.map(ep => (
            <div key={ep.slug} className="episode-card anime-card" style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer',
              background: '#fff'
            }}>
              <h3>{ep.anime_title}</h3>
              <p>Episode {ep.episode_number}</p>
              <p>🏮 {ep.audio_languages.join(', ')}</p>
              <p>👁️ {ep.view_count} views</p>
              <p style={{ fontSize: '12px', color: '#999' }}>📺 {ep.source}</p>
              <button 
                onClick={() => window.location.href = `/watch/${ep.slug}`}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#FF6B6B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                ▶️ Watch Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          style={{ padding: '10px 20px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >
          ← Previous
        </button>
        <span>Page {page} of {Math.ceil(total / 20)}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={episodes.length < 20}
          style={{ padding: '10px 20px', cursor: episodes.length < 20 ? 'not-allowed' : 'pointer' }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default DonghuaBrowse;