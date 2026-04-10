import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

// Import your assets - ensure these exist in src/assets/
import heroImg from '../assets/hero.jpg';
import movieImg from '../assets/movie.jpg';
import animeImg from '../assets/anime.jpg';
import mangaImg from '../assets/manga.jpg';
import myAnimeLogo from '../assets/my-anime.png';
import goodreadsLogo from '../assets/good-reads.png';
import imdbLogo from '../assets/imdb.jpg';

function HomePage() {
  const heroImages = [heroImg, movieImg, animeImg, mangaImg];
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State for posts and view toggle
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // 1. Hero Slider Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // 2. Fetch All Community Posts
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data } = await API.get('/posts');
        const postsArray = Array.isArray(data) ? data : data.posts || [];
        
        // Sort by newest first
        const sorted = postsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sorted);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPosts();
  }, []);

  // Logic to determine how many posts to show
  const displayedPosts = showAll ? posts : posts.slice(0, 4);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <h2>Exploring Boys’ Love Across Media</h2>
            <br />
            <p>
              A curated personal portfolio and community space dedicated to the exploration 
              of Boys’ Love (BL) narratives across cinema, television, anime, and literature.
            </p>
          </div>
          <div className="hero-slider">
            <img 
              src={heroImages[currentIndex]} 
              className="float" 
              alt="Hero Banner" 
            />
          </div>
        </div>
      </section>

      {/* COMMUNITY FEED SECTION */}
      <section className="section-inner" style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', color: '#d63384' }}>Community Feed</h2>
        <p style={{ textAlign: 'center', marginBottom: '3rem' }}>Latest reviews and thoughts from our members.</p>

        <div style={{ background: 'linear-gradient(135deg, rgba(255, 241, 244, 0.95), rgba(241, 247, 255, 0.95), rgba(255, 243, 224, 0.95))', borderRadius: '32px', padding: '28px', boxShadow: '0 30px 90px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading stories...</div>
          ) : (
            <>
            <div style={{ marginBottom: '2.5rem', maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', padding: '0 18px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ marginBottom: '8px' }}>Latest Stories</h3>
                  <p style={{ margin: 0, color: '#666' }}>Fresh community posts.</p>
                </div>
                <span style={{ color: '#888', fontSize: '0.95rem' }}>{posts.length} total posts</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', overflowX: 'auto', padding: '10px 0 8px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                {posts.length > 0 ? posts.slice(0, 4).map((post) => (
                  <div key={post._id} style={{ minWidth: '240px', maxWidth: '280px', borderRadius: '24px', background: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '190px', overflow: 'hidden' }}>
                      {post.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${post.image}`}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ height: '100%', background: '#f8dae1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#d63384', fontSize: '0.85rem' }}>No Cover Image</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                      <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '999px', background: '#fde4ef', color: '#d63384', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.02em' }}>New</span>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>By {post.author?.name || 'Community Member'}</p>
                        <h4 style={{ margin: '6px 0', fontSize: '1.05rem', color: '#222' }}>{post.title}</h4>
                      </div>
                      <p style={{ margin: 0, color: '#555', lineHeight: '1.6', fontSize: '0.92rem' }}>
                        {post.body ? post.body.substring(0, 90) + '...' : 'No content available.'}
                      </p>
                      <Link to={`/posts/${post._id}`} className="site-link" style={{ marginTop: 'auto', fontWeight: '700', textDecoration: 'none' }}>
                        Read Full Review →
                      </Link>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: '#888' }}>No stories available yet.</p>
                )}
              </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 18px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ marginBottom: '8px' }}>Older Posts</h3>
                  <p style={{ margin: 0, color: '#666' }}>Scroll through older community posts below.</p>
                </div>
                <span style={{ color: '#888', fontSize: '0.95rem' }}>{Math.max(posts.length - 4, 0)} older items</span>
              </div>

              <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'grid', gap: '14px', padding: '0 2px 0 2px', boxSizing: 'border-box' }}>
                {posts.length > 4 ? posts.slice(4).map((post) => (
                  <div key={post._id} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 140px) 1fr', gap: '14px', padding: '14px', borderRadius: '20px', background: '#fff', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }}>
                    <div style={{ minWidth: '140px', height: '140px', borderRadius: '18px', overflow: 'hidden', background: '#fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {post.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${post.image}`}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ color: '#d63384', fontSize: '0.85rem' }}>No Image</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '999px', background: '#e8f2ff', color: '#2051b0', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.02em' }}>Older</span>
                      <div>
                        <h4 style={{ margin: '0 0 6px', color: '#d63384' }}>{post.title}</h4>
                        <p style={{ margin: 0, color: '#777', fontSize: '0.85rem' }}>By {post.author?.name || 'Community Member'}</p>
                      </div>
                      <p style={{ margin: 0, color: '#444', lineHeight: '1.7' }}>
                        {post.body ? post.body.substring(0, 160) + '...' : 'No content available.'}
                      </p>
                      <Link to={`/posts/${post._id}`} className="site-link" style={{ marginTop: 'auto', alignSelf: 'flex-start', fontWeight: '700', textDecoration: 'none' }}>
                        Read More →
                      </Link>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: '#888', textAlign: 'center' }}>There are no older posts yet. New stories will appear above.</p>
                )}
              </div>
            </div>
          </>
        )}
        </div>
      </section>

      {/* TOP 3 PICKS SECTION */}
      <section className="top3-section" style={{ background: 'rgba(255,255,255,0.3)', padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center' }}>Personal Top 3 Picks</h2>
        <div className="top3-grid" style={{ marginTop: '2rem' }}>
          <div className="top3-item">
            <img src={movieImg} alt="Movies" />
            <h3 style={{ textAlign: 'center' }}>BL Movies</h3>
            <p style={{ textAlign: 'center' }}>Favorite BL movies chosen for storytelling and emotional impact.</p>
          </div>
          <div className="top3-item">
            <img src={animeImg} alt="Anime" />
            <h3 style={{ textAlign: 'center' }}>BL Anime</h3>
            <p style={{ textAlign: 'center' }}>A selection of series that left a lasting impression.</p>
          </div>
          <div className="top3-item">
            <img src={mangaImg} alt="Manga" />
            <h3 style={{ textAlign: 'center' }}>BL Manga</h3>
            <p style={{ textAlign: 'center' }}>Captivating stories with beautiful art and heartfelt plots.</p>
          </div>
        </div>
      </section>

      {/* RESOURCES & COMMUNITY */}
      <section className="preview" style={{ padding: '4rem 0' }}>
        <h3 style={{ textAlign: 'center' }}>Resources & Community</h3>
        <div className="top3-grid" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div className="top3-item">
            <img src={myAnimeLogo} alt="MAL" style={{ width: '45px', margin: '0 auto 10px' }} />
            <h3>MyAnimeList</h3>
            <a href="https://myanimelist.net" target="_blank" rel="noreferrer" className="site-link">Visit Site</a>
          </div>
          <div className="top3-item">
            <img src={goodreadsLogo} alt="Goodreads" style={{ width: '45px', margin: '0 auto 10px' }} />
            <h3>Goodreads</h3>
            <a href="https://www.goodreads.com" target="_blank" rel="noreferrer" className="site-link">Visit Site</a>
          </div>
          <div className="top3-item">
            <img src={imdbLogo} alt="IMDb" style={{ width: '45px', margin: '0 auto 10px' }} />
            <h3>IMDb</h3>
            <a href="https://www.imdb.com" target="_blank" rel="noreferrer" className="site-link">Visit Site</a>
          </div>
        </div>
      </section>

      {/* KEY HIGHLIGHTS */}
      <section className="highlights-container" style={{ paddingBottom: '4rem' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '2.5rem' }}>Key Highlights</h3>
          <ul className="bl-highlights-centered">
            <li>
              <div className="highlight-card lavender-card">
                <strong>Cross-Platform Analysis</strong>
                <p>Evolution of stories from manga to live-action.</p>
              </div>
            </li>
            <li>
              <div className="highlight-card pink-card">
                <strong>Global Deep Dives</strong>
                <p>Regional styles from Thailand, Japan, and Korea.</p>
              </div>
            </li>
            <li>
              <div className="highlight-card blue-card">
                <strong>Curated Recommendations</strong>
                <p>Hand-picked selections categorized by mood.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HomePage;