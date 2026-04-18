import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Helper function to handle image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x400?text=No+Image";
    
    // If the image is a full Cloudinary link, use it directly
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Otherwise, it's an old post, use the local uploads folder
    return `${backendUrl}/uploads/${imagePath}`;
  };

  // 1. Fetch Post and Comments on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentRes.data);
      } catch (err) {
        console.error("Error loading post data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 2. Handle Like Logic
  const handleLike = async () => {
    if (!user) return alert("Please login to like!");
    try {
      const { data } = await API.put(`/posts/${id}/like`);
      setPost(data);
    } catch (err) {
      console.error("Like failed");
    }
  };

  // 3. Handle Instant Comment Logic
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setIsSubmitting(true);
    try {
      // POST to /api/comments/:postId with { body: text }
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      
      // Update UI instantly by adding the new comment to the state array
      setComments((prev) => [...prev, data]);
      setCommentBody('');
    } catch (err) {
      console.error("Comment failed");
      alert("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle Comment Delete
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '100px' }}>Post not found.</div>;

  return (
    <main>
      <section className="section-inner" style={{ paddingTop: '40px' }}>
        <Link to="/home" style={{ color: '#d63384', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Feed
        </Link>

        <div className="google-form-wrapper" style={{ maxWidth: '850px', margin: '20px auto', background: '#fff', borderRadius: '20px', overflow: 'hidden' }}>
          
          {/* Cover Image */}
          {post.image && (
            <img 
              src={getImageUrl(post.image)} 
              alt="hero" 
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
            />
          )}
          
          <div style={{ padding: '40px' }}>
            <h1 style={{ color: '#d63384', marginBottom: '10px' }}>{post.title}</h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>
              By <strong>{post.author?.name}</strong> • {new Date(post.createdAt).toLocaleDateString()}
            </p>

            <div style={{ margin: '30px 0', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#333' }}>
              {post.body}
            </div>

            {/* LIKE SECTION */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <button 
                onClick={handleLike} 
                style={{ 
                  background: post.likes?.includes(user?._id) ? '#d63384' : '#fff', 
                  color: post.likes?.includes(user?._id) ? '#fff' : '#d63384', 
                  border: '2px solid #d63384',
                  padding: '10px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: '0.3s'
                }}
              >
                {post.likes?.includes(user?._id) ? '❤️ Liked' : '🤍 Like'} ({post.likes?.length || 0})
              </button>
            </div>

            {/* COMMENTS SECTION */}
            <div style={{ marginTop: '50px' }}>
              <h3 style={{ color: '#d63384', borderBottom: '2px solid #fce4ec', paddingBottom: '10px' }}>
                Comments ({comments.length})
              </h3>
              
              {user ? (
                <form onSubmit={handleComment} style={{ boxShadow: 'none', padding: 0, marginTop: '20px' }}>
                  <textarea 
                    value={commentBody} 
                    onChange={(e) => setCommentBody(e.target.value)} 
                    placeholder="Join the discussion..." 
                    rows="3" 
                    required
                    style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                  />
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={isSubmitting}
                    style={{ marginTop: '10px', width: '200px', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <p style={{ marginTop: '20px', color: '#666' }}>
                  Please <Link to="/login" style={{ color: '#d63384', fontWeight: 'bold' }}>Login</Link> to share your thoughts.
                </p>
              )}

              {/* List of Comments */}
              <div style={{ marginTop: '30px' }}>
                {comments.length > 0 ? (
                  comments.map(c => (
                    <div key={c._id} style={{ background: '#fdf2f8', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#d63384' }}>{c.author?.name || 'Member'}</strong>
                        {(user?._id === c.author?._id || user?.role === 'admin') && (
                          <button 
                            onClick={() => handleDeleteComment(c._id)} 
                            style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p style={{ marginTop: '8px', color: '#444', lineHeight: '1.4' }}>{c.body}</p>
                      <small style={{ color: '#aaa', fontSize: '0.7rem' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#aaa', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                    No comments yet. Be the first to start the conversation!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PostPage;