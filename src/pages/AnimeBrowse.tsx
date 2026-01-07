// Anime Browse Page - Backend integrated
import React, { useState, useEffect } from 'react';
import { api, Episode } from '../utils/api';

const AnimeBrowse: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadEpisodes();
  }, [page, sourceFilter]);

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      const data = await api.getEpisodes(page, { 
        content_type: 'anime',
        ...(sourceFilter && { source: sourceFilter })
      });
      setEpisodes(data.episodes);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load episodes:', error);
    }
    setLoading(false);
  };

  return (
    <div className="anime-browse" style={{ padding: '20px' }}>
      <h1>Browse Anime</h1>
      
      {/* Source Filters */}
      <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setSourceFilter(null)} className={!sourceFilter ? 'active' : ''}>
          All Sources
        </button>
        <button onClick={() => setSourceFilter('TPXSUB')} className={sourceFilter === 'TPXSUB' ? 'active' : ''}>
          Hindi Sub (TPXSub)
        </button>
        <button onClick={() => setSourceFilter('SUBSPLEASE')} className={sourceFilter === 'SUBSPLEASE' ? 'active' : ''}>
          English Sub (SubsPlease)
        </button>
        <button onClick={() => setSourceFilter('TOONWORLD')} className={sourceFilter === 'TOONWORLD' ? 'active' : ''}>
          Multi-Audio
        </button>
        <button onClick={() => setSourceFilter('HIANIME')} className={sourceFilter === 'HIANIME' ? 'active' : ''}>
          HiAnime (Old)
        </button>
      </div>

      {/* Episode Grid */}
      <div className="episode-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {loading ? (
          <div>Loading anime...</div>
        ) : episodes.length === 0 ? (
          <div>No episodes found. Run scraper first!</div>
        ) : (
          episodes.map(ep => (
            <div key={ep.slug} className="episode-card anime-card" style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer'
            }}>
              <h3>{ep.anime_title}</h3>
              <p>Episode {ep.episode_number}</p>
              <p>🎧 {ep.audio_languages.join(', ')}</p>
              <p>👁️ {ep.view_count} views</p>
              <button 
                onClick={() => window.location.href = `/watch/${ep.slug}`}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
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

export default AnimeBrowse;